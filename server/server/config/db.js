
import mongoose from "mongoose";
import fs from "fs";
import path from "path";

import { Product } from "../models/Product.js";
import { Saree } from "../models/Saree.js";
import { Category } from "../models/Category.js";
import { User } from "../models/User.js";
import { Order } from "../models/Order.js";
import { Coupon } from "../models/Coupon.js";

import { db } from "../db.js";

// =====================================================
// MONGODB CONNECTION STATE
// =====================================================

let isConnected = false;
let connectionPromise = null;

export { Saree };

export function isMongoConnected() {
  return (
    isConnected &&
    mongoose.connection.readyState === 1
  );
}

// =====================================================
// MONGODB CONNECTION
// =====================================================

export async function connectMongoDB() {
  const mongoUri = process.env.MONGO_URI;

  if (!mongoUri || !mongoUri.trim()) {
    console.warn(
      "[MongoDB] MONGO_URI not found. MongoDB connection skipped."
    );

    isConnected = false;
    return false;
  }

  return connectMongoDBWithUri(mongoUri, false);
}

export async function connectMongoDBWithUri(
  mongoUri,
  updateEnvFile = true
) {
  if (!mongoUri || !mongoUri.trim()) {
    throw new Error("MongoDB URI cannot be empty");
  }

  // Already connected
  if (mongoose.connection.readyState === 1) {
    isConnected = true;

    return {
      success: true,
      dbName: "saree_sansar",
      host: mongoose.connection.host,
      message: "MongoDB is already connected",
    };
  }

  // Reuse existing connection attempt
  if (connectionPromise) {
    return connectionPromise;
  }

  const cleanUri = mongoUri.trim();

  connectionPromise = (async () => {
    try {
      console.log(
        "[MongoDB] Connecting to database: saree_sansar..."
      );

      await mongoose.connect(cleanUri, {
        dbName: "saree_sansar",
        serverSelectionTimeoutMS: 15000,
        connectTimeoutMS: 15000,
        socketTimeoutMS: 45000,
        maxPoolSize: 10,
        minPoolSize: 1,
      });

      isConnected = true;
      process.env.MONGO_URI = cleanUri;

      console.log(
        "[MongoDB] Successfully connected to Atlas"
      );

      // Save URI only in local development
      if (
        updateEnvFile &&
        process.env.NODE_ENV !== "production"
      ) {
        saveUriToEnv(cleanUri);
      }

      // Seed only empty collections
      await seedMongoDBIfEmpty();

      const stats = await getCollectionsCounts();

      console.log("[MongoDB] Collection counts:", stats);

      return {
        success: true,
        dbName: "saree_sansar",
        host: mongoose.connection.host,
        message: "MongoDB connected successfully",
        stats,
      };
    } catch (error) {
      isConnected = false;

      console.error(
        "[MongoDB] Connection Error:",
        error.message
      );

      throw error;
    } finally {
      connectionPromise = null;
    }
  })();

  return connectionPromise;
}

// =====================================================
// CONNECTION EVENTS
// =====================================================

mongoose.connection.on("connected", () => {
  isConnected = true;
  console.log("[MongoDB] Connection established");
});

mongoose.connection.on("disconnected", () => {
  isConnected = false;
  console.warn("[MongoDB] Connection disconnected");
});

mongoose.connection.on("error", (error) => {
  isConnected = false;
  console.error("[MongoDB] Connection error:", error.message);
});

// =====================================================
// DISCONNECT
// =====================================================

export async function disconnectMongoDB() {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
  }

  isConnected = false;
  connectionPromise = null;

  return {
    success: true,
    message: "MongoDB disconnected",
  };
}

// =====================================================
// DATABASE COLLECTION COUNTS
// =====================================================

async function getCollectionsCounts() {
  const [
    products,
    sarees,
    orders,
    users,
    categories,
    coupons,
  ] = await Promise.all([
    Product.countDocuments({}),
    Saree.countDocuments({}),
    Order.countDocuments({}),
    User.countDocuments({}),
    Category.countDocuments({}),
    Coupon.countDocuments({}),
  ]);

  return {
    products,
    sarees,
    orders,
    users,
    categories,
    coupons,
  };
}

// =====================================================
// DATABASE STATUS
// =====================================================

export async function getMongoDBStatus() {
  const readyState = mongoose.connection.readyState;
  const connected = isMongoConnected();

  let counts = {
    products: db.products?.length || 0,
    sarees: 0,
    orders: db.orders?.length || 0,
    users: db.users?.length || 0,
    categories: db.categories?.length || 0,
    coupons: db.coupons?.length || 0,
  };

  if (connected) {
    try {
      counts = await getCollectionsCounts();
    } catch (error) {
      console.error(
        "[MongoDB] Unable to fetch collection counts:",
        error.message
      );
    }
  }

  return {
    isConnected: connected,
    dbName: "saree_sansar",

    host: connected
      ? mongoose.connection.host
      : "not-connected",

    readyState,

    statusText: connected
      ? "Connected to MongoDB Atlas"
      : "MongoDB is not connected",

    activeDatabaseType: connected
      ? "MongoDB Atlas"
      : "Local JSON Database",

    hasEnvUri: Boolean(process.env.MONGO_URI),

    maskedUri: maskMongoUri(
      process.env.MONGO_URI || ""
    ),

    collections: counts,
  };
}

// =====================================================
// SEED MONGODB ONLY WHEN COLLECTION IS EMPTY
// =====================================================

async function seedMongoDBIfEmpty() {
  try {
    console.log("[MongoDB Seed] Checking collections...");

    const [
      productCount,
      sareeCount,
      categoryCount,
      userCount,
      orderCount,
      couponCount,
    ] = await Promise.all([
      Product.countDocuments({}),
      Saree.countDocuments({}),
      Category.countDocuments({}),
      User.countDocuments({}),
      Order.countDocuments({}),
      Coupon.countDocuments({}),
    ]);

    // Products
    if (productCount === 0 && db.products?.length > 0) {
      console.log("[MongoDB Seed] Importing products...");

      await Product.insertMany(db.products, {
        ordered: false,
      });

      console.log(
        `[MongoDB Seed] ${db.products.length} products imported`
      );
    }

    // Sarees
    // Never overwrite existing Saree collection
    if (sareeCount === 0 && db.products?.length > 0) {
      console.log("[MongoDB Seed] Importing sarees...");

      const sareeDocs = db.products.map((product) => ({
        name: product.name,
        slug: product.slug,
        description: product.description || product.name,

        price: Number(product.price || 0),
        originalPrice: Number(
          product.originalPrice || product.price || 0
        ),

        discountPercent: Number(
          product.discountPercent || 0
        ),

        fabricType:
          product.fabric ||
          product.fabricType ||
          "Banarasi Silk",

        weavingTechnique:
          product.weavingTechnique || "",

        artisan:
          product.artisan ||
          "Traditional Indian Artisan",

        inventoryStatus:
          Number(product.stock || 0) === 0
            ? "OUT_OF_STOCK"
            : Number(product.stock || 0) <= 5
              ? "LOW_STOCK"
              : "IN_STOCK",

        category: product.category || "banarasi-silk",

        color: product.color || "Red",

        colorHex: product.colorHex || "#881930",

        occasion: product.occasion || "Festive",

        stock: Number(product.stock ?? 10),

        sku: product.sku,

        images: Array.isArray(product.images)
          ? product.images
          : [],

        silkMarkCertified:
          product.silkMarkCertified ?? false,

        zariType: product.zariType || "",

        blousePieceIncluded:
          product.blousePieceIncluded ?? true,

        sareeLength:
          product.sareeLength ||
          "5.5 meters saree + 0.8 meter blouse piece",

        careInstructions:
          product.careInstructions || "Dry clean only",

        rating: Number(product.rating || 0),

        reviewsCount: Number(product.reviewsCount || 0),

        isFeatured: Boolean(product.isFeatured),

        isBestSeller: Boolean(product.isBestSeller),

        isNewArrival: Boolean(product.isNewArrival),

        specifications: product.specifications || {},
      }));

      await Saree.insertMany(sareeDocs, {
        ordered: false,
      });

      console.log(
        `[MongoDB Seed] ${sareeDocs.length} sarees imported`
      );
    }

    // Categories
    if (
      categoryCount === 0 &&
      db.categories?.length > 0
    ) {
      await Category.insertMany(db.categories, {
        ordered: false,
      });
    }

    // Users
    if (userCount === 0 && db.users?.length > 0) {
      await User.insertMany(db.users, {
        ordered: false,
      });
    }

    // Orders
    if (orderCount === 0 && db.orders?.length > 0) {
      await Order.insertMany(db.orders, {
        ordered: false,
      });
    }

    // Coupons
    if (couponCount === 0 && db.coupons?.length > 0) {
      await Coupon.insertMany(db.coupons, {
        ordered: false,
      });
    }

    console.log("[MongoDB Seed] Collection check completed");

  } catch (error) {
    console.error(
      "[MongoDB Seed] Error:",
      error.message
    );

    // Do not hide database errors
    throw error;
  }
}

// =====================================================
// SYNC LOCAL JSON DATA TO MONGODB
// =====================================================

export async function syncAllDataToMongoDB() {
  if (!isMongoConnected()) {
    throw new Error(
      "MongoDB is not connected. Connect first."
    );
  }

  const syncedCounts = {
    products: 0,
    sarees: 0,
    categories: 0,
    orders: 0,
    users: 0,
    coupons: 0,
  };

  // Products and linked Sarees
  for (const product of db.products || []) {
    if (!product.sku) {
      console.warn(
        "[Sync] Product skipped because SKU is missing"
      );
      continue;
    }

    await Product.findOneAndUpdate(
      { sku: product.sku },
      { $set: product },
      {
        upsert: true,
        runValidators: true,
        setDefaultsOnInsert: true,
      }
    );

    const sareeDoc = {
      name: product.name,
      slug: product.slug,
      description: product.description || product.name,
      price: Number(product.price || 0),
      originalPrice: Number(
        product.originalPrice || product.price || 0
      ),
      discountPercent: Number(
        product.discountPercent || 0
      ),
      fabricType:
        product.fabric ||
        product.fabricType ||
        "Banarasi Silk",
      artisan:
        product.artisan || "Traditional Indian Artisan",
      category: product.category || "banarasi-silk",
      color: product.color || "Red",
      stock: Number(product.stock ?? 10),
      sku: product.sku,
      images: product.images || [],
      blousePieceIncluded:
        product.blousePieceIncluded ?? true,
      sareeLength:
        product.sareeLength ||
        "5.5 meters saree + 0.8 meter blouse",
      careInstructions:
        product.careInstructions || "Dry clean only",
      inventoryStatus:
        Number(product.stock || 0) === 0
          ? "OUT_OF_STOCK"
          : Number(product.stock || 0) <= 5
            ? "LOW_STOCK"
            : "IN_STOCK",
    };

    await Saree.findOneAndUpdate(
      { sku: product.sku },
      { $set: sareeDoc },
      {
        upsert: true,
        runValidators: true,
        setDefaultsOnInsert: true,
      }
    );

    syncedCounts.products++;
    syncedCounts.sarees++;
  }

  // Categories
  for (const category of db.categories || []) {
    await Category.findOneAndUpdate(
      { slug: category.slug },
      { $set: category },
      { upsert: true }
    );

    syncedCounts.categories++;
  }

  // Users
  for (const user of db.users || []) {
    await User.findOneAndUpdate(
      { email: user.email },
      { $set: user },
      { upsert: true }
    );

    syncedCounts.users++;
  }

  // Orders
  for (const order of db.orders || []) {
    await Order.findOneAndUpdate(
      { orderNumber: order.orderNumber },
      { $set: order },
      { upsert: true }
    );

    syncedCounts.orders++;
  }

  // Coupons
  for (const coupon of db.coupons || []) {
    await Coupon.findOneAndUpdate(
      { code: coupon.code },
      { $set: coupon },
      { upsert: true }
    );

    syncedCounts.coupons++;
  }

  return {
    success: true,
    message: "Database synchronization completed",
    syncedCounts,
  };
}

// =====================================================
// SAVE LOCAL DEVELOPMENT URI
// =====================================================

function saveUriToEnv(uri) {
  try {
    const envPath = path.join(process.cwd(), ".env");

    let envContent = "";

    if (fs.existsSync(envPath)) {
      envContent = fs.readFileSync(
        envPath,
        "utf-8"
      );

      if (/^\s*#?\s*MONGO_URI=/m.test(envContent)) {
        envContent = envContent.replace(
          /^\s*#?\s*MONGO_URI=.*$/m,
          `MONGO_URI="${uri}"`
        );
      } else {
        envContent += `\nMONGO_URI="${uri}"\n`;
      }
    } else {
      envContent = `MONGO_URI="${uri}"\n`;
    }

    fs.writeFileSync(
      envPath,
      envContent,
      "utf-8"
    );

    console.log("[Config] Local MONGO_URI saved");

  } catch (error) {
    console.warn(
      "[Config] Could not save local .env:",
      error.message
    );
  }
}

// =====================================================
// MASK DATABASE URI
// =====================================================

function maskMongoUri(uri) {
  if (!uri) return "";

  try {
    return uri.replace(
      /:([^@]+)@/,
      ":********@"
    );
  } catch {
    return "";
  }
}
