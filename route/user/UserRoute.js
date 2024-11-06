const express = require("express");
const router = express.Router();
const UserClass = require("../../controller/user/UserController.js");

router.post("/signup", UserClass.createUser);
router.get("/verify-email", UserClass.verifyEmail);
router.post("/signin", UserClass.loginUser);
router.post("/contact", UserClass.sendContact);
router.post("/recovery-email", UserClass.recoveryEmail);
router.post("/new-password", UserClass.newPassword);
router.get("/get-user", UserClass.getUserDetails);
module.exports = router;
