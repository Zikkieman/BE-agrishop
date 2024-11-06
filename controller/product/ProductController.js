const {
  productSchema,
  favoriteValidationSchema,
  updateProductSchema,
  deleteProductSchema,
} = require("../../model/joi/Joi");
const {
  addProduct,
  getAllProduct,
  getOneProduct,
  addFavoriteProduct,
  deleteFavoriteProduct,
  getFavoriteProducts,
  updateProduct,
  deleteProduct,
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

  static async updateProduct(req, res, next) {
    try {
      const { error } = updateProductSchema.validate(req.body);
      if (error) {
        return res.status(400).json({ message: error.details[0].message });
      }
      return await updateProduct(req.body, res);
    } catch (error) {
      next(error);
    }
  }

  static async deleteProduct(req, res, next) {
    try {
      const { error } = deleteProductSchema.validate(req.body);
      if (error) {
        return res.status(400).json({ message: error.details[0].message });
      }
      return await deleteProduct(req.body, res);
    } catch (error) {
      next(error);
    }
  }

  static async addToFavorite(req, res, next) {
    try {
      const { error } = favoriteValidationSchema.validate(req.body);
      if (error) {
        return res.status(400).json({ message: error.details[0].message });
      }
      return await addFavoriteProduct(req, res);
    } catch (error) {
      next(error);
    }
  }

  static async getFavorites(req, res, next) {
    try {
      return await getFavoriteProducts(req, res);
    } catch (error) {
      next(error);
    }
  }

  static async getAllProduct(req, res, next) {
    try {
      return await getAllProduct(req, res);
    } catch (error) {
      next(error);
    }
  }

  static async deleteFavorite(req, res, next) {
    try {
      return await deleteFavoriteProduct(req, res);
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
