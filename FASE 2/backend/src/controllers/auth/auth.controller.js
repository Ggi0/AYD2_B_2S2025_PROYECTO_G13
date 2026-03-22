"use strict";

const authService = require("../../services/auth/auth.service");

async function register(req, res) {
  try {
    const result = await authService.register(req.body || {});
    return res.status(201).json({ ok: true, ...result });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      ok: false,
      mensaje: error.message || "No se pudo registrar el usuario",
    });
  }
}

async function login(req, res) {
  try {
    const result = await authService.login(req.body || {});
    return res.status(200).json({ ok: true, ...result });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      ok: false,
      mensaje: error.message || "Credenciales invalidas",
    });
  }
}

function me(req, res) {
  return res.status(200).json({
    ok: true,
    mensaje: "Perfil autenticado (base)",
    data: req.user || null,
  });
}

module.exports = {
  register,
  login,
  me,
};
