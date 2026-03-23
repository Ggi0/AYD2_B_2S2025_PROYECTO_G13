// models/usuarios/Usuario.js
// ============================================================
// Modelo de Usuario
// Maneja todas las consultas relacionadas a la tabla usuarios
// CDU001.2, CDU001.3, CDU001.5
// ============================================================

// TODO: cuando tengas la base de datos, importa tu conexión así:
// const { sql, getPool } = require('../../config/database');

// ============================================================
// Buscar usuario por ID
// CDU001.2 - Consultar Usuario
// ============================================================
const buscarPorId = async (id) => {
  // TODO: descomentar cuando tengas la BD
  // const pool = await getPool();
  // const result = await pool.request()
  //   .input('id', sql.Int, id)
  //   .query(`
  //     SELECT 
  //       u.id, u.nit, u.nombre, u.email, u.telefono,
  //       u.tipo_usuario, u.estado, u.fecha_registro,
  //       c.nombre AS creado_por_nombre
  //     FROM usuarios u
  //     LEFT JOIN usuarios c ON c.id = u.creado_por
  //     WHERE u.id = @id
  //   `);
  // return result.recordset[0];
};

// ============================================================
// Listar usuarios con filtros opcionales
// CDU001.2 - Consultar Usuario
// ============================================================
const listarUsuarios = async (filtros = {}) => {
  const { tipo_usuario, estado, nombre } = filtros;

  // TODO: descomentar cuando tengas la BD
  // const pool = await getPool();
  // let query = `
  //   SELECT 
  //     id, nit, nombre, email, telefono,
  //     tipo_usuario, estado, fecha_registro
  //   FROM usuarios
  //   WHERE 1=1
  // `;
  // const request = pool.request();
  //
  // if (tipo_usuario) {
  //   query += ` AND tipo_usuario = @tipo_usuario`;
  //   request.input('tipo_usuario', sql.NVarChar, tipo_usuario);
  // }
  // if (estado) {
  //   query += ` AND estado = @estado`;
  //   request.input('estado', sql.NVarChar, estado);
  // }
  // if (nombre) {
  //   query += ` AND nombre LIKE @nombre`;
  //   request.input('nombre', sql.NVarChar, `%${nombre}%`);
  // }
  //
  // query += ` ORDER BY fecha_registro DESC`;
  // const result = await request.query(query);
  // return result.recordset;
};

// ============================================================
// Actualizar datos generales de un usuario
// CDU001.3 - Modificar Usuario
// Nota: no se puede modificar el NIT si tiene contratos u órdenes
// ============================================================
const actualizarUsuario = async (id, datos) => {
  const { nombre, email, telefono } = datos;

  // TODO: descomentar cuando tengas la BD
  // const pool = await getPool();
  // const result = await pool.request()
  //   .input('id',       sql.Int,      id)
  //   .input('nombre',   sql.NVarChar, nombre)
  //   .input('email',    sql.NVarChar, email)
  //   .input('telefono', sql.NVarChar, telefono)
  //   .query(`
  //     UPDATE usuarios
  //     SET nombre   = @nombre,
  //         email    = @email,
  //         telefono = @telefono
  //     OUTPUT INSERTED.*
  //     WHERE id = @id
  //   `);
  // return result.recordset[0];
};

// ============================================================
// Cambiar estado de un usuario
// CDU001.5 - Bloquear / Desactivar Usuario
// estados posibles: ACTIVO, INACTIVO, BLOQUEADO
// ============================================================
const cambiarEstado = async (id, estado) => {
  // TODO: descomentar cuando tengas la BD
  // const pool = await getPool();
  // const result = await pool.request()
  //   .input('id',     sql.Int,      id)
  //   .input('estado', sql.NVarChar, estado)
  //   .query(`
  //     UPDATE usuarios
  //     SET estado = @estado
  //     OUTPUT INSERTED.id, INSERTED.nombre, INSERTED.estado
  //     WHERE id = @id
  //   `);
  // return result.recordset[0];
};

// ============================================================
// Verificar si un usuario tiene contratos asociados
// CDU001.3 - Regla de negocio: no modificar NIT si tiene historial
// ============================================================
const tieneHistorial = async (id) => {
  // TODO: descomentar cuando tengas la BD
  // const pool = await getPool();
  // const result = await pool.request()
  //   .input('id', sql.Int, id)
  //   .query(`
  //     SELECT COUNT(*) AS total
  //     FROM contratos
  //     WHERE cliente_id = @id
  //   `);
  // return result.recordset[0].total > 0;
};

// ============================================================
// Buscar usuario por NIT
// Para validaciones de duplicado
// ============================================================
const buscarPorNit = async (nit) => {
  // TODO: descomentar cuando tengas la BD
  // const pool = await getPool();
  // const result = await pool.request()
  //   .input('nit', sql.NVarChar, nit)
  //   .query(`
  //     SELECT id, nit, nombre, tipo_usuario, estado
  //     FROM usuarios
  //     WHERE nit = @nit
  //   `);
  // return result.recordset[0];
};

module.exports = {
  buscarPorId,
  listarUsuarios,
  actualizarUsuario,
  cambiarEstado,
  tieneHistorial,
  buscarPorNit
};