const { categorySchema } = require("../../model/joi/Joi");
const { addCategory } = require("../../services/category/CategoryService");

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
}

module.exports = CategoryClass;
