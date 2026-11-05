
import mongoose from "mongoose";

// ==========================================
// PRODUCT SCHEMA
// ==========================================

const ProductSchema = new mongoose.Schema(
  {
    // Basic Information
    name: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
      maxlength: [150, "Product name cannot exceed 150 characters"],
    },

    slug: {
      type: String,
      required: [true, "Product slug is required"],
      unique: true,
      trim: true,
      lowercase: true,
      index: true,
    },

    description: {
      type: String,
      required: [true, "Product description is required"],
      trim: true,
    },

    // Pricing Information
    price: {
      type: Number,
      required: [true, "Product price is required"],
      min: [0, "Price cannot be negative"],
    },

    originalPrice: {
      type: Number,
      required: [true, "Original price is required"],
      min: [0, "Original price cannot be negative"],
    },

    discountPercent: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },

    // Product Classification
    category: {
      type: String,
      required: [true, "Product category is required"],
      trim: true,
      lowercase: true,
      index: true,
    },

    fabric: {
      type: String,
      required: [true, "Fabric type is required"],
      trim: true,
      index: true,
    },

    color: {
      type: String,
      required: [true, "Product color is required"],
      trim: true,
    },

    colorHex: {
      type: String,
      default: "",
      trim: true,
    },

    occasion: {
      type: String,
      default: "Festive",
      trim: true,
    },

    // Saree Details
    artisan: {
      type: String,
      default: "",
      trim: true,
    },

    weavingTechnique: {
      type: String,
      default: "",
      trim: true,
    },

    sareeLength: {
      type: String,
      default: "5.5 meters saree + 0.8 meter blouse",
    },

    blousePieceIncluded: {
      type: Boolean,
      default: true,
    },

    careInstructions: {
      type: String,
      default: "Dry clean only",
    },

    specifications: {
      type: Map,
      of: String,
      default: {},
    },

    // Inventory Management
    stock: {
      type: Number,
      required: true,
      default: 10,
      min: [0, "Stock cannot be negative"],
    },

    sku: {
      type: String,
      required: [true, "Product SKU is required"],
      unique: true,
      trim: true,
      uppercase: true,
    },

    // Product Images
    images: {
      type: [String],
      default: [],
    },

    // Ratings and Reviews
    rating: {
      type: Number,
      default: 5,
      min: 0,
      max: 5,
    },

    reviewsCount: {
      type: Number,
      default: 0,
      min: 0,
    },

    // Product Status
    isFeatured: {
      type: Boolean,
      default: false,
      index: true,
    },

    isBestSeller: {
      type: Boolean,
      default: false,
      index: true,
    },

    isNewArrival: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
    collection: "products",
  }
);

// ==========================================
// INDEXES
// ==========================================

// Unique indexes are maintained for slug and SKU.
// MongoDB automatically creates these from unique: true.

ProductSchema.index({ category: 1, price: 1 });
ProductSchema.index({ isBestSeller: 1, rating: -1 });
ProductSchema.index({ createdAt: -1 });

// ==========================================
// EXPORT MODEL
// ==========================================

export const Product =
  mongoose.models.Product ||
  mongoose.model("Product", ProductSchema);
