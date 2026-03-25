"use strict";

const express = require("express");
const ordenController = require("../../controllers/orden/orden.controller");

const {
  validarGenerarOrden,
  valAsignacionRecursos,
  valSalidaPatio,
  valInicioTransito,
  valEventosTransito,
} = require("../../middlewares/orden/orden.validation.middleware");

const router = express.Router();

router.get("/", ordenController.optenerOrden);
router.post("/", validarGenerarOrden, ordenController.generarOrden);
router.put("/:id", valAsignacionRecursos, ordenController.asignarRecursos);

// Enpoint que no deben de ir aqui pero para facilidad de conflictos los voy a colocar por aquí ;))

router.get("/vehiculos", ordenController.getVehiculos);
router.get("/pilotos", ordenController.getPilotos);

// Rutas destinadas a la logistica de la orden
router.put(
  "/logistica/:id",
  valSalidaPatio,
  ordenController.registrarSalidaPatio,
);

// Gesitones de oredenes en la ruta
router.put(
  "/trasito/inicio/:id",
  valInicioTransito,
  ordenController.actualizarRutaTransito,
);

router.post("/eventos", valEventosTransito, ordenController.eventosTransito);

module.exports = router;
