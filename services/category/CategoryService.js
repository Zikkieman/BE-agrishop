const Category = require("../../model/CategoryModel");
const Product = require("../../model/ProductModel");

const addCategory = async (request, res) => {
  const { category } = request.body;
  try {
    const newCategory = new Category({ category });
    await newCategory.save();
    res.status(201).json(newCategory);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const updateCategory = async (req, res) => {
  try {
    const { category } = req.body;
    const { id } = req.params;
    const updatedCategory = await Category.findByIdAndUpdate(
      id,
      { category },
      { new: true }
    );

    if (!updatedCategory) {
      return res.status(404).json({ message: "Category not found" });
    }

    res.status(200).json(updatedCategory);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    const categoryToDelete = await Category.findById(id);
    if (!categoryToDelete) {
      return res.status(404).json({ message: "Category not found" });
    }

    await Category.deleteOne({ _id: id });
    res
      .status(200)
      .json({ message: "Category and associated products updated" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getCategories = async (request, res) => {
  try {
    const categories = await Category.find();
    res.status(200).json(categories);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = { getCategories, deleteCategory, updateCategory, addCategory };
