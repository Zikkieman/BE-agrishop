const express = require("express");
const AuthClass = require("../../controller/authChecker/AuthController");
const router = express.Router();

router.get("/auth-check", AuthClass.authChecker);
router.get("/logout", AuthClass.logout);

module.exports = router;
