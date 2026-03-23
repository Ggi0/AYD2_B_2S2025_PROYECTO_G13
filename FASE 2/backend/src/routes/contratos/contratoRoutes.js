// routes/contratos/contratoRoutes.js
const express = require('express');
const router  = express.Router();
const {
  crearContrato,
  obtenerContrato,
  listarContratosPorCliente,
  modificarContrato,
  validarCliente,
  agregarDescuento,
  agregarRuta
} = require('../../controllers/contratos/contratoController');

// POST /api/contratos
// Body: { numero_contrato, cliente_id, fecha_inicio, fecha_fin, limite_credito, plazo_pago, tarifas[], rutas[] }
router.post('/', crearContrato);

// GET /api/contratos/validar/:cliente_id
// Query params: ?origen=X&destino=Y&tipo_unidad=Z
// IMPORTANTE: esta ruta debe ir antes de /:id para que no haya conflicto
router.get('/validar/:cliente_id', validarCliente);

// GET /api/contratos/cliente/:cliente_id
router.get('/cliente/:cliente_id', listarContratosPorCliente);

// GET /api/contratos/:id
router.get('/:id', obtenerContrato);

// PUT /api/contratos/:id
// Body: { fecha_inicio, fecha_fin, limite_credito, plazo_pago, estado }
router.put('/:id', modificarContrato);

// POST /api/contratos/:id/descuentos
// Body: { tipo_unidad, porcentaje_descuento, observacion }
router.post('/:id/descuentos', agregarDescuento);

// POST /api/contratos/:id/rutas
// Body: { origen, destino, distancia_km, tipo_carga }
router.post('/:id/rutas', agregarRuta);

module.exports = router;