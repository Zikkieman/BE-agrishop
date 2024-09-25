const Category = require("../../model/CategoryModel");
const Product = require("../../model/ProductModel");

const addProduct = async (body, res) => {
  try {
    const { name, description, price, stock, imageUrl, category, ratings } =
      body;

    const categories = await Category.find({ category: { $in: category } });

    if (categories.length === 0) {
      return res.status(400).json({ message: "No valid categories found" });
    }

    const categoryDetails = categories.map((category) => ({
      _id: category._id,
      category: category.category,
    }));

    const product = new Product({
      name,
      description,
      price,
      stock,
      imageUrl,
      category: categoryDetails,
      ratings,
    });

    await product.save();
    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllProduct = async (res) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getOneProduct = async (req, res) => {
  const { productId } = req.params;
  try {
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json(product);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getProductsByCategory = async (req, res) => {
  const { categoryName } = req.params;
  try {
    const products = await Product.find({ "category.name": categoryName });
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  addProduct,
  getProductsByCategory,
  getAllProduct,
  getOneProduct,
};
