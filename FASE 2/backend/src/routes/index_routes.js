const express = require('express');
const router = express.Router();

// Ruta --> api/
router.get('/', (req, res) => {
    res.status(200).json({
      ok: true,
      mensaje: 'Dentro de la API'
    });
  });

// Importar rutas por módulo
const facturacionRoutes = require('./facturacion/routes_factuacion');
const authRoutes = require('./auth/auth.routes');
const gerencialDashboardRoutes = require('./gerencial/dashboard.routes');

// otras carpetas por ejemplo:
// const contratosRoutes = require('./contratos/routes_contratos');


// Convención general:
// /api/funcion
// ENDPOINT PREFIX: /api/facturacion/*
router.use('/facturacion', facturacionRoutes);
// ENDPOINT PREFIX: /api/auth/*
router.use('/auth', authRoutes);
// ENDPOINT PREFIX: /api/gerencial/*
router.use('/gerencial', gerencialDashboardRoutes);
//  /api/contratos
//  router.use('/contratos', contratosRoutes);

// ... asi para todas las demas rutas

module.exports = router;