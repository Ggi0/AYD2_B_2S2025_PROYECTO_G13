"use strict";
const ordenStore = require("../../models/orden/orden.store");

async function generarOrden(payload) {
  const ctx = await ordenStore.obtenerContextoValidacion(
    payload.cliente_id,
    payload.origen,
    payload.destino,
    payload.peso_estimado,
  );

  if (!ctx.contrato) throw crearError("Contrato no vigente o bloqueado", 403);
  if (ctx.facturasVencidas > 0)
    throw crearError("Tiene facturas vencidas", 403);
  if (!ctx.ruta) throw crearError("Ruta no autorizada por contrato", 403);
  if (!ctx.tarifa) throw crearError("Peso excede capacidad de unidades", 403);

  const costoTotal = ctx.ruta.distancia_km * ctx.tarifa.costo_km;

  if (ctx.contrato.saldo_usado + costoTotal > ctx.contrato.limite_credito) {
    throw crearError("Crédito insuficiente", 403);
  }

  const nuevaOrden = await ordenStore.insertarOrden({
    ...payload,
    contrato_id: ctx.contrato.id,
    costo: costoTotal,
  });

  return { mensaje: "Orden registrada exitosamente", data: nuevaOrden };
}

function crearError(msg, code) {
  const e = new Error(msg);
  e.statusCode = code;
  return e;
}

async function optenerOrden() {
  const ordenes = await ordenStore.obtenerOrdenes();
  return {
    mensaje: "Obtención de ordenes exitosa",
    data: ordenes,
  };
}

async function asignarRecursos(ordenId, payload) {
  const vehiculo = await ordenStore.vehiculoApto(
    payload.vehiculo_id,
    payload.peso_estimado,
  );
  if (!vehiculo) {
    const error = new Error(
      "El vehículo no se encuentra apto o no tiene capacidad",
    );
    error.statusCode = 403;
    throw error;
  }

  const piloto = await ordenStore.conductorApto(payload.piloto_id);
  if (!piloto) {
    const error = new Error("El conductor no se encuentra apto");
    error.statusCode = 403;
    throw error;
  }

  const resultado = await ordenStore.actualizarAsignacion(ordenId, payload);

  return {
    mensaje: "Asignación de recursos exitosa.",
    data: resultado,
  };
}

async function getVehiculos() {
  const vehiculos = await ordenStore.getVehiculos();
  return {
    mensaje: "Obtención de ordenes exitosa",
    data: vehiculos,
  };
}

async function getPilotos() {
  const pilotos = await ordenStore.getPilotos();
  return {
    mensaje: "Obtención de ordenes exitosa",
    data: pilotos,
  };
}

module.exports = {
  generarOrden,
  optenerOrden,
  asignarRecursos,
  getVehiculos,
  getPilotos,
};
