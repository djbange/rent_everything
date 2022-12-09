// npm packages
const express = require("express");

// app imports
const { authHandler } = require("../handlers");

// globals
const router = new express.Router();

/* All the Things Route */
router.post("/login", authHandler.login);
router.post("/signup", authHandler.register);
router.post("/get_2fa_otp", authHandler.getOTP);
router.post("/verify_get_2fa_otp", authHandler.verifyOTP);

module.exports = router;
