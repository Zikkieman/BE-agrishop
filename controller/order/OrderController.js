const {
  updatePaymentSchema,
  updateStatusSchema,
} = require("../../model/joi/Joi");
const {
  createOrder,
  paystackWebhook,
  checkOrderStatus,
  getUserOrders,
  getAllOrders,
  updatePayment,
  updateStatus,
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

  static async updatePayment(req, res, next) {
    try {
      const { error } = updatePaymentSchema.validate(req.body);
      if (error) {
        return res.status(400).json({ message: error.details[0].message });
      }
      return await updatePayment(req, res);
    } catch (error) {
      next(error);
    }
  }

  static async updateStatus(req, res, next) {
    try {
      const { error } = updateStatusSchema.validate(req.body);
      if (error) {
        return res.status(400).json({ message: error.details[0].message });
      }
      return await updateStatus(req, res);
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
