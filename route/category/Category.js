const express = require("express");
const CategoryClass = require("../../controller/category/CategoryController");
const router = express.Router();

router.post("/add-category", CategoryClass.addCategory);

module.exports = router;
