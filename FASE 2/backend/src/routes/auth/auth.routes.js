"use strict";

const express = require("express");
const authController = require("../../controllers/auth/auth.controller");
const { requireAuth } = require("../../middlewares/auth/auth.middleware");
const {
	validateRegister,
	validateLogin,
} = require("../../middlewares/auth/auth.validation.middleware");

const router = express.Router();

router.post("/register", validateRegister, authController.register);
router.post("/login", validateLogin, authController.login);
router.get("/me", requireAuth, authController.me);

module.exports = router;
