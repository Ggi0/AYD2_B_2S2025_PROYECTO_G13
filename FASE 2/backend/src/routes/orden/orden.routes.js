"use strict";

const express = require("express");
const ordenController = require("../../controllers/orden/orden.controller");

const {
  validarGenerarOrden,
  valAsignacionRecursos,
} = require("../../middlewares/orden/orden.validation.middleware");

const router = express.Router();

router.get("/", ordenController.optenerOrden);
router.post("/", validarGenerarOrden, ordenController.generarOrden);
router.put("/:id", valAsignacionRecursos, ordenController.asignarRecursos);

// Enpoint que no deben de ir aqui pero para facilidad de conflictos los voy a colocar por aquí ;))

router.get("/vehiculos", ordenController.getVehiculos);
router.get("/pilotos", ordenController.getPilotos);

module.exports = router;
