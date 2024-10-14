const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 255,
    },
    description: {
      type: String,
      required: true,
      maxlength: 2000,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    category: [
      {
        _id: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Category",
          required: true,
        },
        category: { type: String, required: true },
      },
    ],
    tag: [
      {
        _id: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Tag", // Ensure consistency in casing
          required: true,
        },
        tag: { type: String, required: true },
      },
    ],
    stock: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },
    imageUrl: [
      {
        type: String,
        required: true,
      },
    ],
    ratings: {
      averageRating: {
        type: String,
        default: "0",
      },
    },
  },
  { timestamps: true }
);

const Product =
  mongoose.models.Product ?? mongoose.model("Product", productSchema);

module.exports = Product;
