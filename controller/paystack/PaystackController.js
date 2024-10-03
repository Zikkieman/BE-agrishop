const {
  initPayment,
  verifyPayment,
  paystackWebhook,
} = require("../../services/paystack/PaystackService");

class PaystackClass {
  static async initPayment(req, res, next) {
    try {
      return await initPayment(req, res);
    } catch (error) {
      next(error);
    }
  }

  static async verifyPayment(req, res, next) {
    try {
      return await verifyPayment(req, res);
    } catch (error) {
      next(error);
    }
  }

  static async paystackWebhook(req, res, next) {
    try {
      return await paystackWebhook(req, res);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = PaystackClass;
