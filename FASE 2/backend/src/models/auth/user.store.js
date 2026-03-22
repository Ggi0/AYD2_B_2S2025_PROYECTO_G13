"use strict";

const users = [];
let currentId = 1;

function findByEmail(email) {
  return users.find((user) => user.email === email) || null;
}

function createUser(payload) {
  const user = {
    id: currentId,
    email: payload.email,
    passwordHash: payload.passwordHash,
    role: payload.role,
    nombres: payload.nombres,
    apellidos: payload.apellidos,
    telefono: payload.telefono,
    createdAt: new Date().toISOString(),
  };

  users.push(user);
  currentId += 1;
  return user;
}

module.exports = {
  findByEmail,
  createUser,
};
