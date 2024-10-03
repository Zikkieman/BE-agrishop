const Category = require("../../model/CategoryModel");
const Favorite = require("../../model/FavoriteModel");
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

const addFavoriteProduct = async (req, res) => {
  const userId = req.user.id;
  const { productId, name, price, imageUrl, stock } = req.body;

  try {
    if (!Array.isArray(imageUrl)) {
      return res
        .status(400)
        .json({ message: "imageUrl must be an array of strings" });
    }

    let favorite = await Favorite.findOne({ userId });

    if (!favorite) {
      favorite = new Favorite({
        userId,
        products: [{ productId, name, price, imageUrl, stock }],
      });
    } else {
      const productExists = favorite.products.some(
        (item) => item.productId.toString() === productId
      );
      if (productExists) {
        return res
          .status(400)
          .json({ message: "Product is already in favorites" });
      }

      favorite.products.push({ productId, name, price, imageUrl, stock });
    }

    await favorite.save();
    res.status(200).json({ message: "Product added to favorites", favorite });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteFavoriteProduct = async (req, res) => {
  const userId = req.user.id; // Assume this comes from authentication middleware
  const { id } = req.body; // `id` should refer to the product ID

  try {
    // Find user's favorite list
    const favorite = await Favorite.findOne({ userId });

    if (!favorite) {
      return res.status(404).json({ message: "Favorite list not found" });
    }

    // Remove the product from favorites
    favorite.products = favorite.products.filter(
      (item) => item.productId.toString() !== id
    );

    if (favorite.products.length === 0) {
      // Optionally delete the whole favorite document if no products remain
      await Favorite.deleteOne({ userId });
    } else {
      await favorite.save();
    }

    res.status(200).json({ message: "Product removed from favorites" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getFavoriteProducts = async (req, res) => {
  const userId = req.user.id;

  try {
    const favorite = await Favorite.findOne({ userId }).populate(
      "products.productId"
    );

    if (!favorite || favorite.products.length === 0) {
      return res.status(404).json({ message: "No favorite products found" });
    }

    res.status(200).json({ favoriteProducts: favorite.products });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  addProduct,
  getProductsByCategory,
  getAllProduct,
  getOneProduct,
  addFavoriteProduct,
  deleteFavoriteProduct,
  getFavoriteProducts,
};
