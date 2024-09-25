const { billingInfoValidationSchema } = require("../../model/joi/Joi");
const {
  createBillingInfo,
  deleteBillingInfo,
  updateBillingInfo,
  getBillingInfoByUser,
} = require("../../services/billingInfo/BillingInfoService");

class BillingInfoClass {
  static async createBillingInfo(req, res, next) {
    try {
      const { error } = billingInfoValidationSchema.validate(req.body);
      if (error) {
        return res.status(400).json({ message: error.details[0].message });
      }
      return await createBillingInfo(req, res);
    } catch (error) {
      next(error);
    }
  }

  static async deleteBillingInfo(req, res, next) {
    try {
      return await deleteBillingInfo(req, res);
    } catch (error) {
      next(error);
    }
  }

  static async updateBillingInfo(req, res, next) {
    try {
      const { error } = billingInfoValidationSchema.validate(req.body);
      if (error) {
        return res.status(400).json({ message: error.details[0].message });
      }
      return await updateBillingInfo(req, res);
    } catch (error) {
      next(error);
    }
  }

  static async getBillingInfo(req, res, next) {
    try {
      return await getBillingInfoByUser(req, res);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = BillingInfoClass;
