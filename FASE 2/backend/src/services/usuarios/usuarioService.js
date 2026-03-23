// services/usuarios/usuarioService.js
const Usuario      = require('../../models/usuarios/Usuario');
const RiesgoCliente = require('../../models/usuarios/RiesgoCliente');
const Auditoria    = require('../../models/auditoria/Auditoria');

const obtenerUsuario = async (id) => {
  const usuario = await Usuario.buscarPorId(id);
  if (!usuario) throw { status: 404, mensaje: 'Usuario no encontrado' };

  if (usuario.tipo_usuario === 'CLIENTE_CORPORATIVO') {
    const riesgo = await RiesgoCliente.buscarPorCliente(id);
    usuario.riesgo = riesgo || null;
  }
  return usuario;
};

const listarUsuarios = async (filtros = {}) => {
  return await Usuario.listarUsuarios(filtros);
};

const modificarUsuario = async (id, datos, usuario_ejecutor, ip) => {
  const usuarioActual = await Usuario.buscarPorId(id);
  if (!usuarioActual) throw { status: 404, mensaje: 'Usuario no encontrado' };

  if (datos.nit && datos.nit !== usuarioActual.nit) {
    const tieneHistorial = await Usuario.tieneHistorial(id);
    if (tieneHistorial) {
      throw {
        status: 400,
        mensaje: 'No se puede modificar el NIT porque el usuario tiene contratos u órdenes asociadas'
      };
    }
  }

  const usuarioActualizado = await Usuario.actualizarUsuario(id, datos);

  if (usuarioActual.tipo_usuario === 'CLIENTE_CORPORATIVO' && datos.riesgo) {
    await RiesgoCliente.actualizarRiesgo(id, {
      ...datos.riesgo,
      evaluado_por: usuario_ejecutor
    });
  }

  await Auditoria.registrar({
    tabla_afectada:   'usuarios',
    accion:           'UPDATE',
    registro_id:      id,
    usuario_id:       usuario_ejecutor,
    descripcion:      `Modificación de usuario: ${usuarioActual.nombre}`,
    datos_anteriores: usuarioActual,
    datos_nuevos:     usuarioActualizado,
    ip_origen:        ip
  });

  return usuarioActualizado;
};

const cambiarEstadoUsuario = async (id, estado, motivo, usuario_ejecutor, ip) => {
  const estadosValidos = ['ACTIVO', 'INACTIVO', 'BLOQUEADO'];
  if (!estadosValidos.includes(estado)) {
    throw { status: 400, mensaje: `Estado inválido. Los estados válidos son: ${estadosValidos.join(', ')}` };
  }

  const usuarioActual = await Usuario.buscarPorId(id);
  if (!usuarioActual) throw { status: 404, mensaje: 'Usuario no encontrado' };

  const usuarioActualizado = await Usuario.cambiarEstado(id, estado);

  await Auditoria.registrar({
    tabla_afectada:   'usuarios',
    accion:           'UPDATE',
    registro_id:      id,
    usuario_id:       usuario_ejecutor,
    descripcion:      `Cambio de estado de usuario ${usuarioActual.nombre}: ${usuarioActual.estado} → ${estado}. Motivo: ${motivo}`,
    datos_anteriores: { estado: usuarioActual.estado },
    datos_nuevos:     { estado },
    ip_origen:        ip
  });

  return usuarioActualizado;
};

const crearRiesgoCliente = async (usuario_id, datos, usuario_ejecutor, ip) => {
  const usuario = await Usuario.buscarPorId(usuario_id);
  if (!usuario) throw { status: 404, mensaje: 'Usuario no encontrado' };
  if (usuario.tipo_usuario !== 'CLIENTE_CORPORATIVO') {
    throw { status: 400, mensaje: 'Solo se puede asignar riesgo a clientes corporativos' };
  }

  const nivelesValidos = ['BAJO', 'MEDIO', 'ALTO'];
  const campos = ['riesgo_capacidad_pago', 'riesgo_lavado_dinero', 'riesgo_aduanas', 'riesgo_mercancia'];
  for (const campo of campos) {
    if (!nivelesValidos.includes(datos[campo])) {
      throw { status: 400, mensaje: `Valor inválido en ${campo}. Debe ser: BAJO, MEDIO o ALTO` };
    }
  }

  const riesgo = await RiesgoCliente.crearRiesgo({
    ...datos,
    usuario_id,
    evaluado_por: usuario_ejecutor
  });

  await Auditoria.registrar({
    tabla_afectada: 'riesgo_cliente',
    accion:         'CREATE',
    registro_id:    riesgo.id,
    usuario_id:     usuario_ejecutor,
    descripcion:    `Evaluación de riesgo creada para cliente: ${usuario.nombre}`,
    datos_nuevos:   riesgo,
    ip_origen:      ip
  });

  return riesgo;
};

const obtenerRiesgoCliente = async (usuario_id) => {
  const usuario = await Usuario.buscarPorId(usuario_id);
  if (!usuario) throw { status: 404, mensaje: 'Usuario no encontrado' };
  if (usuario.tipo_usuario !== 'CLIENTE_CORPORATIVO') {
    throw { status: 400, mensaje: 'Solo los clientes corporativos tienen perfil de riesgo' };
  }

  const riesgo = await RiesgoCliente.buscarPorCliente(usuario_id);
  if (!riesgo) throw { status: 404, mensaje: 'No se encontró evaluación de riesgo para este cliente' };

  return riesgo;
};

module.exports = {
  obtenerUsuario,
  listarUsuarios,
  modificarUsuario,
  cambiarEstadoUsuario,
  crearRiesgoCliente,
  obtenerRiesgoCliente
};