
import mongoose, { Schema } from "mongoose";

const SareeSchema = new Schema(
  {
    // Basic Information
    name: {
      type: String,
      required: [true, "Saree name is required"],
      trim: true,
      maxlength: [150, "Saree name cannot exceed 150 characters"],
      index: true,
    },

    slug: {
      type: String,
      required: [true, "Saree slug is required"],
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },

    description: {
      type: String,
      required: [true, "Saree description is required"],
      trim: true,
    },

    // Price Information
    price: {
      type: Number,
      required: [true, "Selling price is required"],
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

    // Saree Details
    fabricType: {
      type: String,
      required: [true, "Fabric type is required"],
      trim: true,
      index: true,
    },

    weavingTechnique: {
      type: String,
      trim: true,
      default: "",
    },

    artisan: {
      type: String,
      trim: true,
      default: "Traditional Indian Artisan",
    },

    category: {
      type: String,
      required: [true, "Category is required"],
      trim: true,
      lowercase: true,
      default: "banarasi-silk",
      index: true,
    },

    color: {
      type: String,
      required: [true, "Color is required"],
      trim: true,
      default: "Red",
    },

    colorHex: {
      type: String,
      default: "#881930",
      trim: true,
    },

    occasion: {
      type: String,
      trim: true,
      default: "Festive",
    },

    // Inventory Information
    stock: {
      type: Number,
      required: true,
      min: [0, "Stock cannot be negative"],
      default: 10,
    },

    inventoryStatus: {
      type: String,
      enum: [
        "IN_STOCK",
        "LOW_STOCK",
        "OUT_OF_STOCK",
        "MADE_TO_ORDER",
      ],
      default: "IN_STOCK",
      index: true,
    },

    sku: {
      type: String,
      required: [true, "SKU is required"],
      unique: true,
      trim: true,
      uppercase: true,
    },

    // Images
    images: {
      type: [String],
      default: [],
    },

    // Additional Information
    silkMarkCertified: {
      type: Boolean,
      default: false,
    },

    zariType: {
      type: String,
      trim: true,
      default: "",
    },

    blousePieceIncluded: {
      type: Boolean,
      default: true,
    },

    sareeLength: {
      type: String,
      default: "5.5 meters saree + 0.8 meter blouse piece",
    },

    careInstructions: {
      type: String,
      default: "Dry clean only",
    },

    // Reviews
    rating: {
      type: Number,
      default: 0,
      min: [0, "Rating cannot be less than 0"],
      max: [5, "Rating cannot exceed 5"],
    },

    reviewsCount: {
      type: Number,
      default: 0,
      min: 0,
    },

    // Product Categories / Flags
    isFeatured: {
      type: Boolean,
      default: false,
    },

    isBestSeller: {
      type: Boolean,
      default: false,
    },

    isNewArrival: {
      type: Boolean,
      default: true,
    },

    // Flexible Specifications
    specifications: {
      type: Map,
      of: String,
      default: {},
    },
  },
  {
    timestamps: true,
    versionKey: false,
    collection: "sarees",
  }
);

// Automatically calculate discount and stock status
SareeSchema.pre("validate", function () {
  if (
    this.originalPrice > 0 &&
    this.originalPrice > this.price
  ) {
    this.discountPercent = Math.round(
      ((this.originalPrice - this.price) /
        this.originalPrice) *
        100
    );
  } else {
    this.discountPercent = 0;
  }

  // Preserve MADE_TO_ORDER when explicitly selected
  if (this.inventoryStatus !== "MADE_TO_ORDER") {
    if (this.stock === 0) {
      this.inventoryStatus = "OUT_OF_STOCK";
    } else if (this.stock <= 5) {
      this.inventoryStatus = "LOW_STOCK";
    } else {
      this.inventoryStatus = "IN_STOCK";
    }
  }
});

// Export Model
export const Saree =
  mongoose.models.Saree ||
  mongoose.model("Saree", SareeSchema);

export default Saree;
