const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
  {
    category: {
      type: String,
      unique: true,
    },
  },
  { timestamps: true }
);

const Category =
  mongoose.models.Category ?? mongoose.model("category", categorySchema);
module.exports = Category;
