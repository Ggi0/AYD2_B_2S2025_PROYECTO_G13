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

module.exports = router;
