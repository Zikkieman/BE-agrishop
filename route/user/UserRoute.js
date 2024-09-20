const express = require("express");
const router = express.Router();
const UserClass = require("../../controller/user/UserController.js");

router.post("/signup", UserClass.createUser);
router.get("/verify-email", UserClass.verifyEmail);
router.post("/signin", UserClass.loginUser);

module.exports = router;
