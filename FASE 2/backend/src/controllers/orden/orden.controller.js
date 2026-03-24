"use strict";

const ordenService = require("../../services/orden/orden.service");

async function generarOrden(req, res) {
  try {
    const result = await ordenService.generarOrden(req.body || {});
    return res.status(201).json({ ok: true, ...result });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      ok: false,
      mensaje: error.message || "No se pudo generar la Orden",
    });
  }
}

async function optenerOrden(req, res) {
  try {
    const result = await ordenService.optenerOrden(req.body || {});
    return res.status(200).json({ ok: true, ...result });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      ok: false,
      mensaje: error.message || "No se pudo obtener el listado de ordenes",
    });
  }
}

async function asignarRecursos(req, res) {
  try {
    const { id } = req.params;
    const result = await ordenService.asignarRecursos(id, req.body);

    return res.status(200).json({ ok: true, ...result });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      ok: false,
      mensaje: error.message || "No se pudo asignar recursos",
    });
  }
}

async function getVehiculos(req, res) {
  try {
    const result = await ordenService.getVehiculos(req.body || {});
    return res.status(200).json({ ok: true, ...result });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      ok: false,
      mensaje: error.message || "No se pudo obtener el listado de ordenes",
    });
  }
}

async function getPilotos(req, res) {
  try {
    const result = await ordenService.getPilotos(req.body || {});
    return res.status(200).json({ ok: true, ...result });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      ok: false,
      mensaje: error.message || "No se pudo obtener el listado de ordenes",
    });
  }
}

async function registrarSalidaPatio(req, res) {
  try {
    const { id } = req.params;
    const result = await ordenService.registrarSalidaPatio(id, req.body || {});
    return res.status(200).json({ ok: true, ...result });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      ok: false,
      mensaje: error.message || "No se pudo obtener el listado de ordenes",
    });
  }
}

module.exports = {
  generarOrden,
  optenerOrden,
  asignarRecursos,
  getVehiculos,
  getPilotos,
  registrarSalidaPatio,
};
