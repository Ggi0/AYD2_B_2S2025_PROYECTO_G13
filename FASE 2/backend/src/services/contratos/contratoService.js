// services/contratos/contratoService.js
const Contrato       = require('../../models/contratos/Contrato');
const ContratoTarifa = require('../../models/contratos/ContratoTarifa');
const Descuento      = require('../../models/contratos/Descuento');
const RutaAutorizada = require('../../models/contratos/RutaAutorizada');
const Usuario        = require('../../models/usuarios/Usuario');
const Auditoria      = require('../../models/auditoria/Auditoria');

const crearContrato = async (datos, usuario_ejecutor, ip) => {
  const { numero_contrato, cliente_id, fecha_inicio, fecha_fin, limite_credito, plazo_pago, tarifas, rutas } = datos;

  const cliente = await Usuario.buscarPorId(cliente_id);
  if (!cliente) throw { status: 404, mensaje: 'Cliente no encontrado' };
  if (cliente.tipo_usuario !== 'CLIENTE_CORPORATIVO') {
    throw { status: 400, mensaje: 'Solo se pueden crear contratos para clientes corporativos' };
  }
  if (cliente.estado !== 'ACTIVO') {
    throw { status: 400, mensaje: 'No se puede crear un contrato para un cliente bloqueado o inactivo' };
  }

  const plazosValidos = [15, 30, 45];
  if (!plazosValidos.includes(plazo_pago)) {
    throw { status: 400, mensaje: 'El plazo de pago debe ser 15, 30 o 45 días' };
  }
  if (new Date(fecha_fin) <= new Date(fecha_inicio)) {
    throw { status: 400, mensaje: 'La fecha de fin debe ser mayor a la fecha de inicio' };
  }

  const contrato = await Contrato.crearContrato({
    numero_contrato, cliente_id, fecha_inicio, fecha_fin,
    limite_credito, plazo_pago, creado_por: usuario_ejecutor
  });

  if (tarifas && tarifas.length > 0) {
    for (const tarifa of tarifas) {
      await ContratoTarifa.crearContratoTarifa({ contrato_id: contrato.id, ...tarifa });
    }
  }

  if (rutas && rutas.length > 0) {
    for (const ruta of rutas) {
      await RutaAutorizada.crearRuta({ contrato_id: contrato.id, ...ruta });
    }
  }

  await Auditoria.registrar({
    tabla_afectada: 'contratos',
    accion:         'CREATE',
    registro_id:    contrato.id,
    usuario_id:     usuario_ejecutor,
    descripcion:    `Contrato ${numero_contrato} creado para cliente: ${cliente.nombre}`,
    datos_nuevos:   contrato,
    ip_origen:      ip
  });

  return contrato;
};

const obtenerContrato = async (id) => {
  const contrato = await Contrato.buscarPorId(id);
  if (!contrato) throw { status: 404, mensaje: 'Contrato no encontrado' };

  contrato.tarifas    = await ContratoTarifa.listarPorContrato(id);
  contrato.rutas      = await RutaAutorizada.listarPorContrato(id);
  contrato.descuentos = await Descuento.listarPorContrato(id);

  return contrato;
};

const listarContratosPorCliente = async (cliente_id) => {
  const cliente = await Usuario.buscarPorId(cliente_id);
  if (!cliente) throw { status: 404, mensaje: 'Cliente no encontrado' };
  return await Contrato.listarPorCliente(cliente_id);
};

const modificarContrato = async (id, datos, usuario_ejecutor, ip) => {
  const contratoActual = await Contrato.buscarPorId(id);
  if (!contratoActual) throw { status: 404, mensaje: 'Contrato no encontrado' };
  if (contratoActual.estado !== 'VIGENTE') {
    throw { status: 400, mensaje: 'Solo se pueden modificar contratos vigentes' };
  }

  if (datos.plazo_pago) {
    const plazosValidos = [15, 30, 45];
    if (!plazosValidos.includes(datos.plazo_pago)) {
      throw { status: 400, mensaje: 'El plazo de pago debe ser 15, 30 o 45 días' };
    }
  }

  const contratoActualizado = await Contrato.actualizarContrato(id, {
    ...datos,
    modificado_por: usuario_ejecutor
  });

  await Auditoria.registrar({
    tabla_afectada:   'contratos',
    accion:           'UPDATE',
    registro_id:      id,
    usuario_id:       usuario_ejecutor,
    descripcion:      `Contrato ${contratoActual.numero_contrato} modificado`,
    datos_anteriores: contratoActual,
    datos_nuevos:     contratoActualizado,
    ip_origen:        ip
  });

  return contratoActualizado;
};

const validarCliente = async (cliente_id, origen, destino, tipo_unidad) => {
  const cliente = await Usuario.buscarPorId(cliente_id);
  if (!cliente) return { habilitado: false, motivo: 'Cliente no encontrado' };
  if (cliente.estado === 'BLOQUEADO') return { habilitado: false, motivo: 'Cliente bloqueado' };
  if (cliente.estado === 'INACTIVO')  return { habilitado: false, motivo: 'Cliente inactivo' };

  const contrato = await Contrato.buscarVigentePorCliente(cliente_id);
  if (!contrato) return { habilitado: false, motivo: 'El cliente no tiene un contrato vigente' };

  if (contrato.saldo_usado >= contrato.limite_credito) {
    await Usuario.cambiarEstado(cliente_id, 'BLOQUEADO');
    return { habilitado: false, motivo: 'Límite de crédito excedido. Cliente bloqueado automáticamente' };
  }

  if (origen && destino) {
    const ruta = await RutaAutorizada.verificarRuta(contrato.id, origen, destino);
    if (!ruta) return { habilitado: false, motivo: `La ruta ${origen} → ${destino} no está autorizada en el contrato` };
  }

  let tarifa   = null;
  let descuento = null;
  if (tipo_unidad) {
    tarifa    = await ContratoTarifa.buscarPorContratoYTipo(contrato.id, tipo_unidad);
    descuento = await Descuento.buscarPorContratoYTipo(contrato.id, tipo_unidad);
  }

  return {
    habilitado: true,
    cliente: { id: cliente.id, nombre: cliente.nombre, estado: cliente.estado },
    contrato: {
      id:               contrato.id,
      numero_contrato:  contrato.numero_contrato,
      limite_credito:   contrato.limite_credito,
      saldo_usado:      contrato.saldo_usado,
      saldo_disponible: contrato.limite_credito - contrato.saldo_usado,
      plazo_pago:       contrato.plazo_pago
    },
    tarifa:    tarifa    ? { tipo_unidad: tarifa.tipo_unidad, costo_km_negociado: tarifa.costo_km_negociado, limite_peso_ton: tarifa.limite_peso_ton } : null,
    descuento: descuento ? { porcentaje_descuento: descuento.porcentaje_descuento } : null
  };
};

const agregarDescuento = async (contrato_id, datos, usuario_ejecutor, ip) => {
  const contrato = await Contrato.buscarPorId(contrato_id);
  if (!contrato) throw { status: 404, mensaje: 'Contrato no encontrado' };
  if (contrato.estado !== 'VIGENTE') {
    throw { status: 400, mensaje: 'Solo se pueden agregar descuentos a contratos vigentes' };
  }

  const descuento = await Descuento.crearDescuento({ contrato_id, ...datos, autorizado_por: usuario_ejecutor });

  await Auditoria.registrar({
    tabla_afectada: 'descuentos_contrato',
    accion:         'CREATE',
    registro_id:    descuento.id,
    usuario_id:     usuario_ejecutor,
    descripcion:    `Descuento especial agregado al contrato ${contrato.numero_contrato}`,
    datos_nuevos:   descuento,
    ip_origen:      ip
  });

  return descuento;
};

const agregarRuta = async (contrato_id, datos, usuario_ejecutor, ip) => {
  const contrato = await Contrato.buscarPorId(contrato_id);
  if (!contrato) throw { status: 404, mensaje: 'Contrato no encontrado' };
  if (contrato.estado !== 'VIGENTE') {
    throw { status: 400, mensaje: 'Solo se pueden agregar rutas a contratos vigentes' };
  }

  const ruta = await RutaAutorizada.crearRuta({ contrato_id, ...datos });

  await Auditoria.registrar({
    tabla_afectada: 'rutas_autorizadas',
    accion:         'CREATE',
    registro_id:    ruta.id,
    usuario_id:     usuario_ejecutor,
    descripcion:    `Ruta ${datos.origen} → ${datos.destino} agregada al contrato ${contrato.numero_contrato}`,
    datos_nuevos:   ruta,
    ip_origen:      ip
  });

  return ruta;
};

module.exports = {
  crearContrato,
  obtenerContrato,
  listarContratosPorCliente,
  modificarContrato,
  validarCliente,
  agregarDescuento,
  agregarRuta
};