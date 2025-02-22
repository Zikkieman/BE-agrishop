const {
  registerUser,
  loginUser,
  sendContact,
  recoveryEmail,
  verifyEmail,
  newPassword,
  getUserDetails,
} = require("../../services/user/UserService.js");
const {
  userSchema,
  loginSchema,
  ContactSchema,
  recoveryEmailSchema,
  newPasswordSchema,
} = require("../../model/joi/Joi.js");
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

  static async getUserDetails(req, res, next) {
    try {
      return await getUserDetails(req, res);
    } catch (error) {
      next(error);
    }
  }

  static async recoveryEmail(request, res, next) {
    try {
      const { error } = recoveryEmailSchema.validate(request.body);
      if (error) {
        return res.status(400).json({ message: error.details[0].message });
      }
      return await recoveryEmail(request.body, res);
    } catch (error) {
      next(error);
    }
  }

  static async newPassword(request, res, next) {
    try {
      const { error } = newPasswordSchema.validate(request.body);
      if (error) {
        return res.status(400).json({ message: error.details[0].message });
      }
      return await newPassword(request.body, res);
    } catch (error) {
      next(error);
    }
  }

  static async sendContact(req, res, next) {
    try {
      const { error } = ContactSchema.validate(req.body);
      if (error) {
        return res.status(400).json({ message: error.details[0].message });
      }
      return await sendContact(req, res);
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
