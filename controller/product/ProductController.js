const { productSchema } = require("../../model/joi/Joi");
const {
  addProduct,
  getAllProduct,
  getOneProduct,
} = require("../../services/product/ProductService");

class ProductClass {
  static async addProduct(request, res, next) {
    try {
      const { error } = productSchema.validate(request.body);
      if (error) {
        return res.status(400).json({ message: error.details[0].message });
      }
      return await addProduct(request.body, res);
    } catch (error) {
      next(error);
    }
  }

  static async getAllProduct(req, res, next) {
    try {
      return await getAllProduct(res);
    } catch (error) {
      next(error);
    }
  }

  static async getOneProduct(req, res, next) {
    try {
      return await getOneProduct(req, res);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = ProductClass;
