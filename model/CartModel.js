const mongoose = require("mongoose");

const cartItemSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  quantity: { type: Number, required: true, default: 1 },
});

const cartSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    items: [cartItemSchema],
    totalAmount: { type: Number, default: 0 }, // New field to store total price
  },
  {
    timestamps: true,
  }
);

const Cart = mongoose.models.Cart ?? mongoose.model("Cart", cartSchema);

module.exports = Cart;
