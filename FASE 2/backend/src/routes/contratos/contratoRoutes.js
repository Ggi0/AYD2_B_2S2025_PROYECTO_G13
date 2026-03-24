/**
 * @file contratoRoutes.js
 * @description Rutas para la gestión de contratos de transporte.
 * Define los endpoints CRUD de contratos, tarifas negociadas, descuentos y rutas autorizadas.
 */

const express      = require('express');
const router       = express.Router();
const { requireAuth } = require('../../middlewares/auth/auth.middleware');
const {
  crearContrato,
  obtenerContrato,
  listarContratosPorCliente,
  modificarContrato,
  validarCliente,
  agregarDescuento,
  agregarRuta
} = require('../../controllers/contratos/contratoController');

/**
 * POST /api/contratos
 * @description Crea un nuevo contrato con tarifas negociadas y rutas autorizadas
 * @auth Requerida (token JWT)
 * @body {
 *   numero_contrato: string - Identificador único del contrato
 *   cliente_id: number - ID del cliente propietario
 *   fecha_inicio: date - Inicio de vigencia
 *   fecha_fin: date - Fin de vigencia
 *   limite_credito: decimal - Crédito disponible
 *   plazo_pago: number - Días de plazo
 *   tarifas: array - Array de tarifas negociadas
 *   rutas: array - Array de rutas autorizadas
 * }
 * @response {status: 201, data: contrato}
 */
router.post('/', requireAuth, crearContrato);

/**
 * GET /api/contratos/validar/:cliente_id
 * @description Valida si un cliente puede hacer una ruta específica con cierta unidad
 * @auth Requerida (token JWT)
 * @params cliente_id: number - ID del cliente
 * @query origen: string - Ubicación de origen
 * @query destino: string - Ubicación de destino
 * @query tipo_unidad: string - Tipo de unidad (Moto, Auto, Camión)
 * @response {status: 200, data: { valido: boolean, contrato: object }}
 * @note IMPORTANTE: esta ruta debe ir antes de /:id para evitar conflictos
 */
router.get('/validar/:cliente_id', requireAuth, validarCliente);

/**
 * GET /api/contratos/cliente/:cliente_id
 * @description Lista todos los contratos de un cliente específico
 * @auth Requerida (token JWT)
 * @params cliente_id: number - ID del cliente
 * @response {status: 200, data: [contratos]}
 */
router.get('/cliente/:cliente_id', requireAuth, listarContratosPorCliente);

/**
 * GET /api/contratos/:id
 * @description Obtiene los detalles completos de un contrato
 * @auth Requerida (token JWT)
 * @params id: number - ID del contrato
 * @response {status: 200, data: contrato}
 */
router.get('/:id', requireAuth, obtenerContrato);

/**
 * PUT /api/contratos/:id
 * @description Actualiza los datos principales de un contrato
 * @auth Requerida (token JWT)
 * @params id: number - ID del contrato
 * @body {
 *   fecha_inicio: date - Nueva fecha de inicio
 *   fecha_fin: date - Nueva fecha de fin
 *   limite_credito: decimal - Nuevo límite de crédito
 *   plazo_pago: number - Nuevo plazo en días
 *   estado: string - Nuevo estado (VIGENTE, VENCIDO, CANCELADO)
 * }
 * @response {status: 200, data: contratoActualizado}
 */
router.put('/:id', requireAuth, modificarContrato);

/**
 * POST /api/contratos/:id/descuentos
 * @description Agrega un descuento a un tipo de unidad en el contrato
 * @auth Requerida (token JWT)
 * @params id: number - ID del contrato
 * @body {
 *   tipo_unidad: string - Tipo de unidad (Moto, Auto, Camión)
 *   porcentaje_descuento: decimal - Porcentaje de descuento (0-100)
 *   observacion: string - Razón del descuento
 * }
 * @response {status: 201, data: descuento}
 */
router.post('/:id/descuentos', requireAuth, agregarDescuento);

/**
 * POST /api/contratos/:id/rutas
 * @description Autoriza una nueva ruta de transporte en el contrato
 * @auth Requerida (token JWT)
 * @params id: number - ID del contrato
 * @body {
 *   origen: string - Ubicación de salida
 *   destino: string - Ubicación de llegada
 *   distancia_km: decimal - Distancia aproximada
 *   tipo_carga: string - Tipo de carga permitida
 * }
 * @response {status: 201, data: ruta}
 */
router.post('/:id/rutas', requireAuth, agregarRuta);

module.exports = router;