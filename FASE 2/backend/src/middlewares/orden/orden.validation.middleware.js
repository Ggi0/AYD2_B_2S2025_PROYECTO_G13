"use strict";

function validarGenerarOrden(req, res, next) {
  const { cliente_id, origen, destino, tipo_mercancia, peso_estimado } =
    req.body;

  if (!cliente_id || !origen || !destino || !tipo_mercancia || !peso_estimado) {
    return res.status(400).json({
      ok: false,
      mensaje:
        "Faltan campos obligatorios: cliente_id, origen, destino, tipo_mercancia o peso_estimado.",
    });
  }

  if (isNaN(peso_estimado) || peso_estimado <= 0) {
    return res.status(400).json({
      ok: false,
      mensaje: "El peso estimado debe ser un número mayor a cero.",
    });
  }

  next();
}

function valAsignacionRecursos(req, res, next) {
  const { id } = req.params;
  const { vehiculo_id, piloto_id, peso_estimado } = req.body;

  if (!id || isNaN(id)) {
    return res
      .status(400)
      .json({ ok: false, mensaje: "ID de orden inválido." });
  }

  if (!vehiculo_id || !piloto_id || !peso_estimado) {
    return res
      .status(400)
      .json({ ok: false, mensaje: "Faltan campos obligatorios." });
  }

  next();
}

function valSalidaPatio(req, res, next) {
  const { id } = req.params;
  const { codigo_orden, peso_real, asegurada, estibada } = req.body;

  if (!id || isNaN(id)) {
    return res
      .status(400)
      .json({ ok: false, mensaje: "ID de orden inválido." });
  }

  if (!codigo_orden || !peso_real || !asegurada || !estibada) {
    return res
      .status(400)
      .json({ ok: false, mensaje: "Faltan campos obligatorios." });
  }
  next();
}

module.exports = {
  validarGenerarOrden,
  valAsignacionRecursos,
  valSalidaPatio,
};
