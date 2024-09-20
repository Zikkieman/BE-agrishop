const {
  registerUser,
  verifyEmail,
  loginUser,
} = require("../../services/user/UserService.js");
const { userSchema, loginSchema } = require("../../model/joi/Joi.js");
const asyncHandler = require("express-async-handler");

class UserClass {
  static async createUser(request, res, next) {
    try {
      const { error } = userSchema.validate(request.body);
      if (error) {
        return res.status(400).json({ message: error.details[0].message });
      }
      return await registerUser(request.body, res);
    } catch (error) {
      next(error);
    }
  }

  static async verifyEmail(request, res, next) {
    try {
      return await verifyEmail(request, res);
    } catch (error) {
      next(error);
    }
  }

  static async loginUser(request, res, next) {
    try {
      const { error } = loginSchema.validate(request.body);
      if (error) {
        return res.status(400).json({ message: error.details[0].message });
      }
      return await loginUser(request.body, res);
    } catch (error) {
      next(error);
    }
  }
}
module.exports = UserClass;
