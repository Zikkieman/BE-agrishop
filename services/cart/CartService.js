const Cart = require("../../model/CartModel");
const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET;

const addToCart = async (req, res) => {
  const { items } = req.body;
  const { id: userId } = req.user;

  try {
    let cart = await Cart.findOne({ userId });

    if (!cart) {
      cart = new Cart({ userId, items });
    } else {
      items.forEach(({ productId, quantity }) => {
        const existingProductIndex = cart.items.findIndex(
          (item) => item.productId.toString() === productId
        );

        if (existingProductIndex > -1) {
          cart.items[existingProductIndex].quantity += quantity;
        } else {
          cart.items.push({ productId, quantity });
        }
      });
    }

    await cart.save();
    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateCart = async (req, res) => {
  const { id: userId } = req.user;
  const { productId, quantity } = req.body;
  try {
    const cart = await Cart.findOne({ userId });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    const productIndex = cart.items.findIndex(
      (item) => item.productId.toString() === productId
    );

    if (productIndex === -1) {
      return res.status(404).json({ message: "Product not found in cart" });
    }

    if (quantity === 0) {
      cart.items.splice(productIndex, 1);
    } else {
      cart.items[productIndex].quantity = quantity;
    }

    await cart.save();
    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteFromCart = async (req, res) => {
  const { productId } = req.body;
  const { id: userId } = req.user;

  try {
    const cart = await Cart.findOne({ userId });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    cart.items = cart.items.filter(
      (item) => item.productId.toString() !== productId
    );

    await cart.save();
    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getUserCart = async (req, res) => {
  const { id: userId } = req.user;
  try {
    const cart = await Cart.findOne({ userId }).populate("items.productId");

    if (!cart) {
      return res.status(404).json({ message: "Your cart is empty" });
    }

    let totalAmount = 0;
    cart.items.forEach((item) => {
      const productPrice = item.productId.price;
      const quantity = item.quantity;
      totalAmount += productPrice * quantity;
    });

    cart.totalAmount = totalAmount;
    await cart.save();
    res.status(200).json({ cart, totalAmount });
  } catch (error) {
    res.status(500).json({
      message: "An error occurred while retrieving the cart. Please try again.",
    });
  }
};

module.exports = { addToCart, updateCart, deleteFromCart, getUserCart };
