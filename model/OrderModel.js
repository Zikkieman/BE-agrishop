const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    items: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: { type: Number, required: true },
        price: { type: Number, required: true },
      },
    ],
    totalAmount: { type: Number, required: true },
    billingInfo: {
      firstName: String,
      lastName: String,
      address: String,
      state: String,
      country: String,
    },
    additionalInfo: { type: String },
    paymentStatus: {
      type: String,
      enum: ["pending", "completed", "failed"],
      default: "pending",
    },
    status: {
      type: String,
      enum: ["pending", "processing", "completed", "cancelled"],
      default: "pending",
    },
    reference: {
      type: String,
      require: true,
      unique: true,
    },
  },
  {
    timestamps: true,
  }
);

const Order = mongoose.models.Order ?? mongoose.model("Order", orderSchema);

module.exports = Order;
