"use strict";

const bcrypt = require("bcryptjs");
const { signJwt } = require("../../utils/jwt");
const userStore = require("../../models/auth/user.store");
const { notificarInformativo } = require("../../utils/mailer");

const ALLOWED_ROLES = ["cliente", "piloto", "finanzas", "gerencia", "operativo"];

function createHttpError(message, statusCode) {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
}

function validateEmail(email) {
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailPattern.test(email);
}

function sanitizeRole(role) {
  return String(role || "cliente").trim().toLowerCase();
}

function getDisplayName(user) {
  const fullName = `${user.nombres || ""} ${user.apellidos || ""}`.trim();
  if (fullName) return fullName;
  return user.email;
}

async function register(payload) {
  const {
    email,
    password,
    confirmPassword,
    role = "cliente",
    nombres = "",
    apellidos = "",
    telefono = "",
  } = payload;

  if (!email || !password || !confirmPassword) {
    throw createHttpError("Email, password y confirmPassword son obligatorios", 400);
  }

  if (!validateEmail(email)) {
    throw createHttpError("Formato de email invalido", 400);
  }

  if (password.length < 8) {
    throw createHttpError("La password debe tener al menos 8 caracteres", 400);
  }

  if (password !== confirmPassword) {
    throw createHttpError("La confirmacion de password no coincide", 400);
  }

  const finalRole = sanitizeRole(role);
  if (!ALLOWED_ROLES.includes(finalRole)) {
    throw createHttpError("Rol no permitido", 400);
  }

  const existingUser = userStore.findByEmail(email.toLowerCase());
  if (existingUser) {
    throw createHttpError("El email ya se encuentra registrado", 409);
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const user = userStore.createUser({
    email: email.toLowerCase(),
    passwordHash,
    role: finalRole,
    nombres: String(nombres || "").trim(),
    apellidos: String(apellidos || "").trim(),
    telefono: String(telefono || "").trim(),
  });

  try {
    await notificarInformativo(
      user.email,
      getDisplayName(user),
      "Tu cuenta ha sido creada correctamente en la plataforma de LogiTrans.",
      {
        titulo: "Registro Exitoso",
        detalle: "Ya puedes iniciar sesión con tu correo y contraseña.",
        datos: [
          { etiqueta: "Correo", valor: user.email },
          { etiqueta: "Rol", valor: user.role },
          { etiqueta: "Id de Usuario", valor: String(user.id) },
        ],
      }
    );
  } catch (error) {
    // No bloquear el registro si el envío de correo falla.
    console.error("[auth] Registro completado, pero falló la notificación por correo:", error.message);
  }

  return {
    mensaje: "Usuario registrado correctamente",
    data: {
      id: user.id,
      email: user.email,
      role: user.role,
      nombres: user.nombres,
      apellidos: user.apellidos,
      telefono: user.telefono,
    },
  };
}

async function login(payload) {
  const { email, password } = payload;

  if (!email || !password) {
    throw createHttpError("Email y password son obligatorios", 400);
  }

  if (!validateEmail(email)) {
    throw createHttpError("Formato de email invalido", 400);
  }

  const user = userStore.findByEmail(email.toLowerCase());
  if (!user) {
    throw createHttpError("Credenciales invalidas", 401);
  }

  const isValidPassword = await bcrypt.compare(password, user.passwordHash);
  if (!isValidPassword) {
    throw createHttpError("Credenciales invalidas", 401);
  }

  const token = signJwt({
    sub: String(user.id),
    email: user.email,
    role: user.role,
  });

  return {
    mensaje: "Login exitoso",
    data: {
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        nombres: user.nombres,
        apellidos: user.apellidos,
      },
    },
  };
}

module.exports = {
  register,
  login,
};
