// controllers/contratos/contratoController.js
const contratoService = require('../../services/contratos/contratoService');

const crearContrato = async (req, res) => {
  try {
    const datos            = req.body;
    const usuario_ejecutor  = req.usuario_id;
    const ip               = req.ip;

    const camposObligatorios = ['numero_contrato', 'cliente_id', 'fecha_inicio', 'fecha_fin', 'limite_credito', 'plazo_pago'];
    for (const campo of camposObligatorios) {
      if (!datos[campo]) return res.status(400).json({ ok: false, mensaje: `El campo ${campo} es obligatorio` });
    }

    const contrato = await contratoService.crearContrato(datos, usuario_ejecutor, ip);
    res.status(201).json({ ok: true, mensaje: 'Contrato creado correctamente', data: contrato });
  } catch (error) {
    res.status(error.status || 500).json({ ok: false, mensaje: error.mensaje || 'Error al crear contrato' });
  }
};

const obtenerContrato = async (req, res) => {
  try {
    const { id } = req.params;
    const contrato = await contratoService.obtenerContrato(Number(id));
    res.status(200).json({ ok: true, data: contrato });
  } catch (error) {
    res.status(error.status || 500).json({ ok: false, mensaje: error.mensaje || 'Error al obtener contrato' });
  }
};

const listarContratosPorCliente = async (req, res) => {
  try {
    const { cliente_id } = req.params;
    const contratos = await contratoService.listarContratosPorCliente(Number(cliente_id));
    res.status(200).json({ ok: true, data: contratos });
  } catch (error) {
    res.status(error.status || 500).json({ ok: false, mensaje: error.mensaje || 'Error al listar contratos' });
  }
};

const modificarContrato = async (req, res) => {
  try {
    const { id }           = req.params;
    const datos            = req.body;
    const usuario_ejecutor  = req.usuario_id;
    const ip               = req.ip;

    const contratoActualizado = await contratoService.modificarContrato(Number(id), datos, usuario_ejecutor, ip);
    res.status(200).json({ ok: true, mensaje: 'Contrato actualizado correctamente', data: contratoActualizado });
  } catch (error) {
    res.status(error.status || 500).json({ ok: false, mensaje: error.mensaje || 'Error al modificar contrato' });
  }
};

const validarCliente = async (req, res) => {
  try {
    const { cliente_id }                   = req.params;
    const { origen, destino, tipo_unidad } = req.query;

    const resultado = await contratoService.validarCliente(Number(cliente_id), origen, destino, tipo_unidad);
    res.status(200).json({ ok: true, data: resultado });
  } catch (error) {
    res.status(error.status || 500).json({ ok: false, mensaje: error.mensaje || 'Error al validar cliente' });
  }
};

const agregarDescuento = async (req, res) => {
  try {
    const { id }           = req.params;
    const datos            = req.body;
    const usuario_ejecutor  = req.usuario_id;
    const ip               = req.ip;

    if (!datos.tipo_unidad || !datos.porcentaje_descuento) {
      return res.status(400).json({ ok: false, mensaje: 'Los campos tipo_unidad y porcentaje_descuento son obligatorios' });
    }

    const descuento = await contratoService.agregarDescuento(Number(id), datos, usuario_ejecutor, ip);
    res.status(201).json({ ok: true, mensaje: 'Descuento agregado correctamente', data: descuento });
  } catch (error) {
    res.status(error.status || 500).json({ ok: false, mensaje: error.mensaje || 'Error al agregar descuento' });
  }
};

const agregarRuta = async (req, res) => {
  try {
    const { id }           = req.params;
    const datos            = req.body;
    const usuario_ejecutor  = req.usuario_id;
    const ip               = req.ip;

    if (!datos.origen || !datos.destino) {
      return res.status(400).json({ ok: false, mensaje: 'Los campos origen y destino son obligatorios' });
    }

    const ruta = await contratoService.agregarRuta(Number(id), datos, usuario_ejecutor, ip);
    res.status(201).json({ ok: true, mensaje: 'Ruta autorizada agregada correctamente', data: ruta });
  } catch (error) {
    res.status(error.status || 500).json({ ok: false, mensaje: error.mensaje || 'Error al agregar ruta' });
  }
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