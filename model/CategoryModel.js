const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
  {
    category: {
      type: String,
      unique: true, // This is sufficient to enforce uniqueness
      required: true,
      trim: true,
    },
  },
  { timestamps: true }
);

categorySchema.pre("findOneAndDelete", async function (next) {
  const categoryId = this.getQuery()._id;
  await mongoose
    .model("Product")
    .updateMany(
      { "category._id": categoryId },
      { $pull: { category: { _id: categoryId } } }
    );
  next();
});

categorySchema.pre("findOneAndUpdate", async function (next) {
  const categoryId = this.getQuery()._id;
  const newCategory = this.getUpdate().$set.category; // Get the updated category name

  if (newCategory) {
    await mongoose.model("Product").updateMany(
      { "category._id": categoryId },
      { $set: { "category.$.category": newCategory } } // Update the category name in all products
    );
  }

  next();
});

const Category =
  mongoose.models.Category ?? mongoose.model("Category", categorySchema);
module.exports = Category;
