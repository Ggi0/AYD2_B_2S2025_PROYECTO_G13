// routes/tarifario/tarifarioRoutes.js
const express = require('express');
const router  = express.Router();
const {
  obtenerTarifario,
  obtenerTarifaPorTipo,
  actualizarTarifa,
  obtenerRangosReferencia
} = require('../../controllers/tarifario/tarifarioController');

// GET /api/tarifario
router.get('/', obtenerTarifario);

// GET /api/tarifario/referencia
// IMPORTANTE: esta ruta debe ir antes de /:tipo_unidad para que no haya conflicto
router.get('/referencia', obtenerRangosReferencia);

// GET /api/tarifario/:tipo_unidad
// tipo_unidad: LIGERA, PESADA, CABEZAL
router.get('/:tipo_unidad', obtenerTarifaPorTipo);

// PUT /api/tarifario/:tipo_unidad
// Body: { limite_peso_ton, costo_base_km }
router.put('/:tipo_unidad', actualizarTarifa);

module.exports = router;