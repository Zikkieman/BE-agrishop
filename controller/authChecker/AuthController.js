const {
  authCheck,
  logout,
} = require("../../services/authChecker/AuthCheckService");

class AuthClass {
  static async authChecker(req, res, next) {
    try {
      return await authCheck(req, res);
    } catch (error) {
      next(error);
    }
  }

  static async logout(req, res, next) {
    try {
      return await logout(req, res);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = AuthClass;
