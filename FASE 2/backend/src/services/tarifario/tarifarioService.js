// services/tarifario/tarifarioService.js
const Tarifario = require('../../models/tarifario/Tarifario');
const Auditoria = require('../../models/auditoria/Auditoria');

const TIPOS_UNIDAD = ['LIGERA', 'PESADA', 'CABEZAL'];

const RANGOS_REFERENCIA = {
  LIGERA:  { limite_peso_ton: 3.5,  costo_base_km: 8.00  },
  PESADA:  { limite_peso_ton: 12.0, costo_base_km: 12.50 },
  CABEZAL: { limite_peso_ton: 22.0, costo_base_km: 18.00 }
};

const obtenerTarifario = async () => {
  return await Tarifario.listarTarifario();
};

const obtenerTarifaPorTipo = async (tipo_unidad) => {
  if (!TIPOS_UNIDAD.includes(tipo_unidad)) {
    throw { status: 400, mensaje: `Tipo de unidad inválido. Los tipos válidos son: ${TIPOS_UNIDAD.join(', ')}` };
  }
  const tarifa = await Tarifario.buscarPorTipo(tipo_unidad);
  if (!tarifa) throw { status: 404, mensaje: `No se encontró tarifa para el tipo: ${tipo_unidad}` };
  return tarifa;
};

const actualizarTarifa = async (tipo_unidad, datos, usuario_ejecutor, ip) => {
  const { limite_peso_ton, costo_base_km } = datos;

  if (!TIPOS_UNIDAD.includes(tipo_unidad)) {
    throw { status: 400, mensaje: `Tipo de unidad inválido. Los tipos válidos son: ${TIPOS_UNIDAD.join(', ')}` };
  }
  if (limite_peso_ton <= 0) throw { status: 400, mensaje: 'El límite de peso debe ser mayor a 0' };
  if (costo_base_km   <= 0) throw { status: 400, mensaje: 'El costo por km debe ser mayor a 0' };

  const tarifaActual = await Tarifario.buscarPorTipo(tipo_unidad);

  const tarifaActualizada = await Tarifario.actualizarTarifa(tipo_unidad, {
    limite_peso_ton,
    costo_base_km,
    actualizado_por: usuario_ejecutor
  });

  await Auditoria.registrar({
    tabla_afectada:   'tarifario',
    accion:           'UPDATE',
    registro_id:      tarifaActualizada.id,
    usuario_id:       usuario_ejecutor,
    descripcion:      `Tarifa actualizada para tipo de unidad: ${tipo_unidad}`,
    datos_anteriores: tarifaActual,
    datos_nuevos:     tarifaActualizada,
    ip_origen:        ip
  });

  return tarifaActualizada;
};

const obtenerRangosReferencia = () => {
  return RANGOS_REFERENCIA;
};

module.exports = {
  obtenerTarifario,
  obtenerTarifaPorTipo,
  actualizarTarifa,
  obtenerRangosReferencia
};