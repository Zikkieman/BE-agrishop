const {
  createOrder,
  paystackWebhook,
  checkOrderStatus,
  getUserOrders,
  getAllOrders,
} = require("../../services/order/OrderService");

class OrderClass {
  static async createPayment(req, res, next) {
    try {
      return await createOrder(req, res);
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

  static async orderStatus(req, res, next) {
    try {
      return await checkOrderStatus(req, res);
    } catch (error) {
      next(error);
    }
  }

  static async userOrders(req, res, next) {
    try {
      return await getUserOrders(req, res);
    } catch (error) {
      next(error);
    }
  }

  static async allOrders(req, res, next) {
    try {
      return await getAllOrders(req, res);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = OrderClass;
