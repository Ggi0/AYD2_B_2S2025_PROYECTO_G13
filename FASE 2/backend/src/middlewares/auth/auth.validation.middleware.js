"use strict";

const ALLOWED_ROLES = ["cliente", "piloto", "finanzas", "gerencia", "operativo"];

function isValidEmail(email) {
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailPattern.test(String(email || ""));
}

function validateRegister(req, res, next) {
  const {
    email,
    password,
    confirmPassword,
    role = "cliente",
  } = req.body || {};

  if (!email || !password || !confirmPassword) {
    return res.status(400).json({
      ok: false,
      mensaje: "Email, password y confirmPassword son obligatorios",
    });
  }

  if (!isValidEmail(email)) {
    return res.status(400).json({
      ok: false,
      mensaje: "Formato de email invalido",
    });
  }

  if (String(password).length < 8) {
    return res.status(400).json({
      ok: false,
      mensaje: "La password debe tener al menos 8 caracteres",
    });
  }

  if (password !== confirmPassword) {
    return res.status(400).json({
      ok: false,
      mensaje: "La confirmacion de password no coincide",
    });
  }

  if (!ALLOWED_ROLES.includes(String(role).toLowerCase())) {
    return res.status(400).json({
      ok: false,
      mensaje: "Rol no permitido",
    });
  }

  return next();
}

function validateLogin(req, res, next) {
  const { email, password } = req.body || {};

  if (!email || !password) {
    return res.status(400).json({
      ok: false,
      mensaje: "Email y password son obligatorios",
    });
  }

  if (!isValidEmail(email)) {
    return res.status(400).json({
      ok: false,
      mensaje: "Formato de email invalido",
    });
  }

  return next();
}

module.exports = {
  validateRegister,
  validateLogin,
};
