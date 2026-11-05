
import { Router } from "express";
import { db } from "../db.js";
import { Saree } from "../models/Saree.js";
import { Product } from "../models/Product.js";
import { isMongoConnected } from "../config/db.js";

const router = Router();

// ==========================================
// 1. HELPER FUNCTIONS
// ==========================================

const createSlug = (text) => {
  return String(text || "saree")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
};

const makeUniqueSlug = async (text, excludeSku = null) => {
  const baseSlug = createSlug(text);
  let slug = baseSlug;
  let count = 1;

  if (!isMongoConnected()) return slug;

  while (true) {
    const query = { slug };

    if (excludeSku) {
      query.sku = { $ne: excludeSku };
    }

    const [existingProduct, existingSaree] = await Promise.all([
      Product.findOne(query).lean(),
      Saree.findOne(query).lean()
    ]);

    if (!existingProduct && !existingSaree) {
      return slug;
    }

    slug = `${baseSlug}-${count}`;
    count++;
  }
};

const normalizeProduct = (p) => ({
  ...p,
  id: p.id || p._id?.toString(),
  name: p.name || "",
  slug: p.slug || "",
  description: p.description || "",
  category: p.category || "",
  fabric: p.fabric || p.fabricType || "",
  color: p.color || "",
  occasion: p.occasion || "",
  sku: p.sku || "",
  price: Number(p.price || 0),
  originalPrice: Number(p.originalPrice || p.price || 0),
  stock: Number(p.stock || 0),
  rating: Number(p.rating || 0),
  images: Array.isArray(p.images) ? p.images : [],
  specifications: p.specifications || {}
});

// ==========================================
// 2. GET ALL PRODUCTS
// ==========================================

router.get("/", async (req, res) => {
  try {
    const {
      category,
      search,
      fabric,
      occasion,
      minPrice,
      maxPrice,
      sortBy,
      inStockOnly,
      weavingTechnique,
      technique,
      artisan
    } = req.query;

    let list = [...(db.products || [])];

    // MongoDB products first
    if (isMongoConnected()) {
      let mongoProducts = await Product.find({}).lean();

      // If Product collection is empty, check Saree collection
      if (!mongoProducts.length) {
        mongoProducts = await Saree.find({}).lean();
      }

      if (mongoProducts.length) {
        list = mongoProducts.map(normalizeProduct);
      }
    }

    // Category filter
    if (category && category !== "all") {
      list = list.filter(
        p => (p.category || "").toLowerCase() ===
          category.toLowerCase()
      );
    }

    // Search filter
    if (search) {
      const q = search.toLowerCase().trim();

      list = list.filter(p => {
        const searchable = [
          p.name,
          p.description,
          p.fabric,
          p.fabricType,
          p.color,
          p.sku,
          p.weavingTechnique,
          p.specifications?.Weave,
          p.artisan,
          p.specifications?.Artisan,
          p.specifications?.Origin
        ];

        return searchable.some(value =>
          String(value || "").toLowerCase().includes(q)
        );
      });
    }

    // Weaving technique filter
    const targetTechnique = weavingTechnique || technique;

    if (targetTechnique && targetTechnique !== "all") {
      const tq = targetTechnique.toLowerCase().trim();

      list = list.filter(p =>
        String(p.weavingTechnique || "").toLowerCase().includes(tq) ||
        String(p.specifications?.Weave || "").toLowerCase().includes(tq) ||
        String(p.description || "").toLowerCase().includes(tq)
      );
    }

    // Artisan filter
    if (artisan && artisan !== "all") {
      const art = artisan.toLowerCase().trim();

      list = list.filter(p =>
        String(p.artisan || "").toLowerCase().includes(art) ||
        String(p.specifications?.Artisan || "").toLowerCase().includes(art) ||
        String(p.specifications?.Origin || "").toLowerCase().includes(art) ||
        String(p.description || "").toLowerCase().includes(art)
      );
    }

    // Fabric filter
    if (fabric && fabric !== "all") {
      list = list.filter(
        p => (p.fabric || p.fabricType || "").toLowerCase() ===
          fabric.toLowerCase()
      );
    }

    // Occasion filter
    if (occasion && occasion !== "all") {
      list = list.filter(
        p => (p.occasion || "").toLowerCase() ===
          occasion.toLowerCase()
      );
    }

    // Price filters
    if (minPrice !== undefined && minPrice !== "") {
      list = list.filter(p => p.price >= Number(minPrice));
    }

    if (maxPrice !== undefined && maxPrice !== "") {
      list = list.filter(p => p.price <= Number(maxPrice));
    }

    // Stock filter
    if (inStockOnly === "true") {
      list = list.filter(p => p.stock > 0);
    }

    // Sorting
    switch (sortBy) {
      case "price-asc":
        list.sort((a, b) => a.price - b.price);
        break;

      case "price-desc":
        list.sort((a, b) => b.price - a.price);
        break;

      case "rating":
        list.sort((a, b) => b.rating - a.rating);
        break;

      case "newest":
        list.sort(
          (a, b) =>
            new Date(b.createdAt || 0) -
            new Date(a.createdAt || 0)
        );
        break;

      case "popular":
        list.sort(
          (a, b) =>
            Number(b.isBestSeller) - Number(a.isBestSeller)
        );
        break;
    }

    return res.json(list);

  } catch (error) {
    console.error("GET Products Error:", error);

    return res.status(500).json({
      success: false,
      message: "Products load failed",
      error: error.message
    });
  }
});

// ==========================================
// 3. GET SINGLE PRODUCT
// ==========================================

router.get("/:slug", async (req, res) => {
  try {
    const { slug } = req.params;
    let found = null;

    if (isMongoConnected()) {
      const conditions = [
        { slug },
        { id: slug },
        { sku: slug }
      ];

      if (/^[0-9a-fA-F]{24}$/.test(slug)) {
        conditions.push({ _id: slug });
      }

      found =
        await Product.findOne({ $or: conditions }).lean() ||
        await Saree.findOne({ $or: conditions }).lean();
    }

    if (!found) {
      found = (db.products || []).find(
        p => p.slug === slug || p.id === slug || p.sku === slug
      );
    }

    if (!found) {
      return res.status(404).json({
        success: false,
        message: "Product not found"
      });
    }

    return res.json(normalizeProduct(found));

  } catch (error) {
    console.error("Single Product Error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to load product"
    });
  }
});

// ==========================================
// 4. ADD PRODUCT
// ==========================================

router.post("/", async (req, res) => {
  try {
    const data = req.body || {};

    if (!data.name || data.price === undefined || data.price === null) {
      return res.status(400).json({
        success: false,
        message: "Product name and price are required"
      });
    }

    const price = Number(data.price);

    if (!Number.isFinite(price) || price <= 0) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid product price"
      });
    }

    const sku = data.sku ||
      `SS-WEAVE-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    const slug = await makeUniqueSlug(data.slug || data.name);

    const newProduct = {
      id: `prod-${Date.now()}`,
      name: data.name.trim(),
      slug,
      price,
      originalPrice: Number(data.originalPrice) || price * 1.25,
      discountPercent: data.originalPrice
        ? Math.round(
            ((Number(data.originalPrice) - price) /
              Number(data.originalPrice)) * 100
          )
        : 20,
      description: data.description ||
        "Authentic handloom saree crafted by master weavers.",
      category: data.category || "banarasi-silk",
      fabric: data.fabric || data.fabricType || "Banarasi Silk",
      color: data.color || "Royal Crimson",
      occasion: data.occasion || "Festive",
      stock: Math.max(0, Number(data.stock ?? 10)),
      sku,
      images: Array.isArray(data.images)
        ? data.images
        : [],
      rating: 5,
      reviewsCount: 1,
      isFeatured: Boolean(data.isFeatured),
      isBestSeller: Boolean(data.isBestSeller),
      isNewArrival: true,
      blousePieceIncluded: data.blousePieceIncluded ?? true,
      sareeLength: data.sareeLength ||
        "5.5 meters saree + 0.8 meter blouse",
      careInstructions: data.careInstructions ||
        "Dry clean only. Store in muslin.",
      artisan: data.artisan || "",
      specifications: data.specifications || {
        Weave: "Handloom",
        Origin: "Varanasi"
      },
      createdAt: new Date().toISOString()
    };

    if (isMongoConnected()) {
      const sareeDoc = {
        ...newProduct,
        fabricType: newProduct.fabric,
        artisan: newProduct.artisan ||
          "Heritage Handloom Guild, Varanasi Looms",
        inventoryStatus: newProduct.stock === 0
          ? "OUT_OF_STOCK"
          : newProduct.stock <= 5
            ? "LOW_STOCK"
            : "IN_STOCK"
      };

      await Product.create(newProduct);
      await Saree.findOneAndUpdate(
        { sku: newProduct.sku },
        sareeDoc,
        { upsert: true, new: true, runValidators: true }
      );
    }

    db.products = db.products || [];
    db.products.unshift(newProduct);

    if (typeof db.save === "function") {
      db.save();
    }

    return res.status(201).json({
      success: true,
      message: "Product added successfully",
      product: newProduct
    });

  } catch (error) {
    console.error("Add Product Error:", error);

    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "Duplicate product slug or SKU. Please try again.",
        duplicateField: error.keyValue
      });
    }

    return res.status(500).json({
      success: false,
      message: "Product could not be added",
      error: error.message
    });
  }
});

// ==========================================
// 5. UPDATE PRODUCT
// ==========================================

router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body || {};

    let existing = (db.products || []).find(
      p => p.id === id || p.sku === id || p.slug === id
    );

    let mongoExisting = null;

    if (isMongoConnected()) {
      const conditions = [
        { id },
        { sku: id },
        { slug: id }
      ];

      if (/^[0-9a-fA-F]{24}$/.test(id)) {
        conditions.push({ _id: id });
      }

      mongoExisting = await Product.findOne({
        $or: conditions
      }).lean();

      if (!mongoExisting) {
        return res.status(404).json({
          success: false,
          message: "Product not found in MongoDB"
        });
      }

      existing = normalizeProduct(mongoExisting);
    }

    if (!existing) {
      return res.status(404).json({
        success: false,
        message: "Product not found"
      });
    }

    const updated = {
      ...existing,
      ...data,
      id: existing.id
    };

    // Generate a unique slug if slug or name changed
    if (data.slug || data.name) {
      const requestedSlug = data.slug || data.name;

      if (createSlug(requestedSlug) !== createSlug(existing.slug)) {
        updated.slug = await makeUniqueSlug(
          requestedSlug,
          existing.sku
        );
      } else {
        updated.slug = existing.slug;
      }
    }

    updated.price = Number(updated.price);
    updated.stock = Number(updated.stock ?? 0);

    if (
      !Number.isFinite(updated.price) ||
      updated.price <= 0
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid product price"
      });
    }

    if (isMongoConnected()) {
      const mongoUpdate = { ...updated };
      delete mongoUpdate._id;
      delete mongoUpdate.__v;

      const sareeUpdate = {
        ...mongoUpdate,
        fabricType: updated.fabric || updated.fabricType,
        inventoryStatus: updated.stock === 0
          ? "OUT_OF_STOCK"
          : updated.stock <= 5
            ? "LOW_STOCK"
            : "IN_STOCK"
      };

      await Product.findOneAndUpdate(
        { _id: mongoExisting._id },
        { $set: mongoUpdate },
        { new: true, runValidators: true }
      );

      await Saree.findOneAndUpdate(
        { sku: existing.sku },
        { $set: sareeUpdate },
        { upsert: true, new: true, runValidators: true }
      );
    }

    const index = (db.products || []).findIndex(
      p => p.id === existing.id
    );

    if (index !== -1) {
      db.products[index] = updated;

      if (typeof db.save === "function") {
        db.save();
      }
    }

    return res.json({
      success: true,
      message: "Product updated successfully",
      product: updated
    });

  } catch (error) {
    console.error("Update Product Error:", error);

    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "Duplicate slug or SKU. Please use a different value.",
        duplicateField: error.keyValue
      });
    }

    return res.status(500).json({
      success: false,
      message: "Product update failed",
      error: error.message
    });
  }
});

// ==========================================
// 6. DELETE PRODUCT
// ==========================================

router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    let target = (db.products || []).find(
      p => p.id === id || p.sku === id || p.slug === id
    );

    if (isMongoConnected()) {
      const conditions = [
        { id },
        { sku: id },
        { slug: id }
      ];

      if (/^[0-9a-fA-F]{24}$/.test(id)) {
        conditions.push({ _id: id });
      }

      const mongoTarget = await Product.findOne({
        $or: conditions
      }).lean();

      if (mongoTarget) {
        target = normalizeProduct(mongoTarget);

        await Product.deleteOne({ _id: mongoTarget._id });

        if (target.sku) {
          await Saree.deleteOne({ sku: target.sku });
        }
      }
    }

    const initialLength = (db.products || []).length;

    db.products = (db.products || []).filter(
      p => p.id !== id &&
        p.sku !== id &&
        p.slug !== id &&
        (!target || p.id !== target.id)
    );

    if (
      db.products.length === initialLength &&
      !target
    ) {
      return res.status(404).json({
        success: false,
        message: "Product not found"
      });
    }

    if (typeof db.save === "function") {
      db.save();
    }

    return res.json({
      success: true,
      message: "Product deleted successfully"
    });

  } catch (error) {
    console.error("Delete Product Error:", error);

    return res.status(500).json({
      success: false,
      message: "Product deletion failed",
      error: error.message
    });
  }
});

export default router;
