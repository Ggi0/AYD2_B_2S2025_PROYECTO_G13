const express = require('express');
const router = express.Router();

// Ruta base de facturación
// GET /api/facturacion
router.get('/', (req, res) => {
  res.status(200).json({
    ok: true,
    modulo: 'facturacion',
    mensaje: 'Ruta principal de facturación'
  });
});

// Ejemplo: obtener facturas
// GET /api/facturacion/facturas
router.get('/facturas', (req, res) => {
  res.status(200).json({
    ok: true,
    mensaje: 'Listado de facturas',
    data: []
  });
});

// Ejemplo: crear factura
// POST /api/facturacion/facturas
router.post('/facturas', (req, res) => {
  const datos = req.body;

  res.status(201).json({
    ok: true,
    mensaje: 'Factura creada correctamente',
    data: datos
  });
});

module.exports = router;