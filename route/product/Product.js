const express = require("express");
const ProductClass = require("../../controller/product/ProductController");
const verifyToken = require("../../middleware/VerifyToken");
const router = express.Router();

router.post("/add-product", ProductClass.addProduct);
router.get("/all-products", ProductClass.getAllProduct);
router.delete("/delete-product", ProductClass.deleteProduct);
router.put("/update-product", ProductClass.updateProduct);
router.get("/one-product/:productId", ProductClass.getOneProduct);
router.post("/favorites", verifyToken, ProductClass.addToFavorite);
router.get("/favorites", verifyToken, ProductClass.getFavorites);
router.delete("/favorites", verifyToken, ProductClass.deleteFavorite);

module.exports = router;
