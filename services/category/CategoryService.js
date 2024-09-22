const Category = require("../../model/CategoryModel");

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

const updateCategory = async (request, res) => {
  try {
    const { id } = request.params;
    const { name } = request.body;
    const updatedCategory = await Category.findByIdAndUpdate(
      id,
      { name },
      { new: true }
    );
    res.status(200).json(updatedCategory);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const deleteCategory = async (request, res) => {
  try {
    const { id } = request.params;
    await Category.findByIdAndDelete(id);
    res.status(200).json({ message: "Category deleted" });
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
