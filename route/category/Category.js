const express = require("express");
const CategoryClass = require("../../controller/category/CategoryController");
const router = express.Router();

router.post("/add-category", CategoryClass.addCategory);
router.get("/get-category", CategoryClass.getCategories);

module.exports = router;
