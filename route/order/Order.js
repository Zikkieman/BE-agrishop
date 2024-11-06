const express = require("express");
const verifyToken = require("../../middleware/VerifyToken");
const OrderClass = require("../../controller/order/OrderController");
const router = express.Router();

router.post("/create-order", verifyToken, OrderClass.createPayment);
router.post("/webhook", OrderClass.paystackWebhook);
router.get("/payment-status", OrderClass.orderStatus);
router.get("/get-user-orders", verifyToken, OrderClass.userOrders);
router.get("/get-all-orders", verifyToken, OrderClass.allOrders);
router.post("/update-payment", verifyToken, OrderClass.updatePayment);
router.post("/update-status", verifyToken, OrderClass.updateStatus);
module.exports = router;
