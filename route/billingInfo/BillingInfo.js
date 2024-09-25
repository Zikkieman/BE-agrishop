const express = require("express");
const BillingInfoClass = require("../../controller/billingInfo/BillingInfoController");
const verifyToken = require("../../middleware/VerifyToken");
const router = express.Router();

router.get(
  "/get-user-billing-info",
  verifyToken,
  BillingInfoClass.getBillingInfo
);
router.post(
  "/create-billing-info",
  verifyToken,
  BillingInfoClass.createBillingInfo
);
router.delete(
  "/delete-billing-info",
  verifyToken,
  BillingInfoClass.deleteBillingInfo
);
router.put(
  "/update-billing-info",
  verifyToken,
  BillingInfoClass.updateBillingInfo
);

module.exports = router;
