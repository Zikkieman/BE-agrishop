const express = require("express");
const AuthClass = require("../../controller/authChecker/AuthController");
const router = express.Router();

router.get("/auth-check", AuthClass.authChecker);
router.get("/logout", AuthClass.logout);
router.get("/refresh-token", AuthClass.refreshAccessToken);

module.exports = router;
