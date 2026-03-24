"use strict";

const express = require("express");
const authController = require("../../controllers/auth/auth.controller");
const { requireAuth } = require("../../middlewares/auth/auth.middleware");
const {
	validateRegister,
	validateLogin,
} = require("../../middlewares/auth/auth.validation.middleware");

const router = express.Router();

// ENDPOINT: POST /api/auth/register
// Flujo: validateRegister -> authController.register -> authService.register -> user.store.createUser
router.post("/register", validateRegister, authController.register);

// ENDPOINT: POST /api/auth/login
// Flujo: validateLogin -> authController.login -> authService.login -> user.store.findByEmail
router.post("/login", validateLogin, authController.login);

// ENDPOINT: GET /api/auth/me
// Flujo: requireAuth (valida JWT) -> authController.me
router.get("/me", requireAuth, authController.me);

module.exports = router;
