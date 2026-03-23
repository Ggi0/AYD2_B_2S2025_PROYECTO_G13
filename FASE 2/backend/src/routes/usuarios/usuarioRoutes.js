// routes/usuarios/usuarioRoutes.js
const express = require('express');
const router  = express.Router();
const {
  listarUsuarios,
  obtenerUsuario,
  modificarUsuario,
  cambiarEstadoUsuario,
  crearRiesgoCliente,
  obtenerRiesgoCliente
} = require('../../controllers/usuarios/usuarioController');

// GET /api/usuarios?tipo_usuario=X&estado=Y&nombre=Z
router.get('/', listarUsuarios);

// GET /api/usuarios/:id
router.get('/:id', obtenerUsuario);

// PUT /api/usuarios/:id
router.put('/:id', modificarUsuario);

// PATCH /api/usuarios/:id/estado
// Body: { estado, motivo }
router.patch('/:id/estado', cambiarEstadoUsuario);

// POST /api/usuarios/:id/riesgo
// Body: { riesgo_capacidad_pago, riesgo_lavado_dinero, riesgo_aduanas, riesgo_mercancia }
router.post('/:id/riesgo', crearRiesgoCliente);

// GET /api/usuarios/:id/riesgo
router.get('/:id/riesgo', obtenerRiesgoCliente);

module.exports = router;