const {
  cartValidation,
  deleteFromCartSchema,
  cartItemSchema,
} = require("../../model/joi/Joi");
const {
  addToCart,
  updateCart,
  deleteFromCart,
  getUserCart,
} = require("../../services/cart/CartService");

class CartClass {
  static async addToCart(req, res, next) {
    try {
      const { error } = cartValidation(req.body);
      if (error) {
        return res.status(400).json({ message: error.details });
      }
      return await addToCart(req, res);
    } catch (error) {
      next(error);
    }
  }

  static async updateCart(req, res, next) {
    try {
      const { error } = cartItemSchema.validate(req.body);
      if (error) {
        return res.status(400).json({ message: error.details[0].message });
      }
      return await updateCart(req, res);
    } catch (error) {
      next(error);
    }
  }

  static async deleteFromCart(req, res, next) {
    try {
      const { error } = deleteFromCartSchema.validate(req.body);
      if (error) {
        return res.status(400).json({ message: error.details[0].message });
      }
      return await deleteFromCart(req, res);
    } catch (error) {
      next(error);
    }
  }

  static async getUserCart(req, res, next) {
    try {
      return await getUserCart(req, res);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = CartClass;
