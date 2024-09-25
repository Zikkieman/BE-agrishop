const express = require("express");
const CartClass = require("../../controller/cart/CartController");
const verifyToken = require("../../middleware/VerifyToken");
const router = express.Router();

router.post("/add-to-cart", verifyToken, CartClass.addToCart);
router.get("/get-user-cart", verifyToken, CartClass.getUserCart);
router.delete("/delete-from-cart", verifyToken, CartClass.deleteFromCart);
router.put("/update-cart", verifyToken, CartClass.updateCart);

module.exports = router;
