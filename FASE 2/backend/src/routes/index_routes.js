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

// otras carpetas por ejemplo:
// const contratosRoutes = require('./contratos/routes_contratos');


const usuarioRoutes   = require('./usuarios/usuarioRoutes');
const contratoRoutes  = require('./contratos/contratoRoutes');
const tarifarioRoutes = require('./tarifario/tarifarioRoutes');


// Convención general:
// /api/funcion
router.use('/facturacion', facturacionRoutes);
router.use('/auth', authRoutes);
router.use('/usuarios',    usuarioRoutes);
router.use('/contratos',   contratoRoutes);
router.use('/tarifario',   tarifarioRoutes);
//  /api/contratos
//  router.use('/contratos', contratosRoutes);

// ... asi para todas las demas rutas

module.exports = router;