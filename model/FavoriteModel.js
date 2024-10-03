const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const favoriteSchema = new Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  products: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
      },
      name: { type: String, required: true },
      price: { type: Number, required: true },
      imageUrl: { type: [String], required: true },
      stock: { type: Number, required: true },
    },
  ],
});

const Favorite =
  mongoose.models.Favorite ?? mongoose.model("Favorite", favoriteSchema);

module.exports = Favorite;
