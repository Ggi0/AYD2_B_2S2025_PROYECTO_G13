"use strict";
const ordenStore = require("../../models/orden/orden.store");

async function generarOrden(payload) {
  // Verificar si existe contrato vigente
  const contrato = await ordenStore.obtenerContratoValido(payload.cliente_id);
  if (!contrato) {
    const error = new Error(
      "El cliente no posee un contrato vigente o está bloqueado.",
    );
    error.statusCode = 403;
    throw error;
  }

  // Validar si el contrato no tiene facturas vencidas
  const cuentas_por_cobrar = await ordenStore.facturasVencidas(
    payload.cliente_id,
  );
  if (cuentas_por_cobrar) {
    const error = new Error(
      "Tiene facturas venciada no puede realizar mas Ordenes.",
    );
    error.statusCode = 403;
    throw error;
  }

  // Validar Por contrato el destino y origen
  const desplazamiento = await ordenStore.desplazaminetoAutorizado(
    contrato.id,
    payload.origen,
    payload.destino,
  );
  if (!desplazamiento) {
    const error = new Error("Desplazamiento No autorizado");
    error.statusCode = 403;
    throw error;
  }

  // Obtener el costo del trasporte dependiendo de su tarifa por contrato
  const costoPorPeso = await ordenStore.tarifaCamion(
    contrato.id,
    payload.peso_estimado,
  );

  if (!costoPorPeso) {
    const error = new Error(
      "El peso solicitado sobrepasa a el de nuestras unidades",
    );
    error.statusCode = 403;
    throw error;
  }

  const costoTotalDesplazamiento =
    desplazamiento.distancia_km * costoPorPeso.costo_km;

  if (
    contrato.saldo_usado + costoTotalDesplazamiento >=
    contrato.limite_credito
  ) {
    const error = new Error(
      "No cuenta con credito suficiente para la generar la Orden",
    );
    error.statusCode = 403;
    throw error;
  }

  // 3. Insertar en BD
  const nuevaOrden = await ordenStore.insertarOrden({
    ...payload,
    contrato_id: contrato.id,
    costo: costoTotalDesplazamiento,
  });

  return {
    mensaje: "Orden de servicio registrada exitosamente",
    data: nuevaOrden,
  };
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

module.exports = { generarOrden, optenerOrden, asignarRecursos };
