const { categorySchema, updateCategorySchema } = require("../../model/joi/Joi");
const {
  addCategory,
  getCategories,
  updateCategory,
  deleteCategory,
} = require("../../services/category/CategoryService");

class CategoryClass {
  static async addCategory(request, res, next) {
    try {
      const { error } = categorySchema.validate(request.body);
      if (error) {
        return res.status(400).json({ message: error.details[0].message });
      }
      return await addCategory(request, res);
    } catch (error) {
      next(error);
    }
  }

  static async updateCategory(request, res, next) {
    try {
      const { error } = updateCategorySchema.validate(request.body);
      if (error) {
        return res.status(400).json({ message: error.details[0].message });
      }
      return await updateCategory(request, res);
    } catch (error) {
      next(error);
    }
  }

  static async deleteCategory(request, res, next) {
    try {
      return await deleteCategory(request, res);
    } catch (error) {
      next(error);
    }
  }

  static getCategories = async (request, res, next) => {
    try {
      return await getCategories(request, res);
    } catch (error) {
      next(error);
    }
  };
}

module.exports = CategoryClass;
