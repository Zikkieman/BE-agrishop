const express = require("express");
const ProductClass = require("../../controller/product/ProductController");
const router = express.Router();

router.post("/add-product", ProductClass.addProduct);
router.get("/all-products", ProductClass.getAllProduct);
router.get("/one-product/:productId", ProductClass.getOneProduct);

module.exports = router;
