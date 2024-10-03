const express = require("express");
const PaystackClass = require("../../controller/paystack/PaystackController");
const verifyToken = require("../../middleware/VerifyToken");
const router = express.Router();

router.post("/initialize", verifyToken, PaystackClass.initPayment);
router.get("/verify/:reference", verifyToken, PaystackClass.verifyPayment);
router.post("/webhook", PaystackClass.paystackWebhook);

module.exports = router;
