const express = require("express");
const ProductClass = require("../../controller/product/ProductController");
const router = express.Router();

router.post("/add-product", ProductClass.addProduct);
router.get("/all-products", ProductClass.getAllProduct);
module.exports = router;
