// models/usuarios/Usuario.js
const sql = require('mssql');
const { getConnection } = require('../../config/database');

const buscarPorId = async (id) => {
  const pool = await getConnection();
  const result = await pool.request()
    .input('id', sql.Int, id)
    .query(`
      SELECT 
        u.id, u.nit, u.nombre, u.email, u.telefono,
        u.tipo_usuario, u.estado, u.fecha_registro,
        c.nombre AS creado_por_nombre
      FROM usuarios u
      LEFT JOIN usuarios c ON c.id = u.creado_por
      WHERE u.id = @id
    `);
  return result.recordset[0];
};

const listarUsuarios = async (filtros = {}) => {
  const { tipo_usuario, estado, nombre } = filtros;
  const pool = await getConnection();
  const request = pool.request();

  let query = `
    SELECT id, nit, nombre, email, telefono,
           tipo_usuario, estado, fecha_registro
    FROM usuarios
    WHERE 1=1
  `;

  if (tipo_usuario) {
    query += ` AND tipo_usuario = @tipo_usuario`;
    request.input('tipo_usuario', sql.NVarChar, tipo_usuario);
  }
  if (estado) {
    query += ` AND estado = @estado`;
    request.input('estado', sql.NVarChar, estado);
  }
  if (nombre) {
    query += ` AND nombre LIKE @nombre`;
    request.input('nombre', sql.NVarChar, `%${nombre}%`);
  }

  query += ` ORDER BY fecha_registro DESC`;
  const result = await request.query(query);
  return result.recordset;
};

const actualizarUsuario = async (id, datos) => {
  const { nombre, email, telefono } = datos;
  const pool = await getConnection();
  const result = await pool.request()
    .input('id',       sql.Int,      id)
    .input('nombre',   sql.NVarChar, nombre)
    .input('email',    sql.NVarChar, email)
    .input('telefono', sql.NVarChar, telefono)
    .query(`
      UPDATE usuarios
      SET nombre = @nombre, email = @email, telefono = @telefono
      OUTPUT INSERTED.*
      WHERE id = @id
    `);
  return result.recordset[0];
};

const cambiarEstado = async (id, estado) => {
  const pool = await getConnection();
  const result = await pool.request()
    .input('id',     sql.Int,      id)
    .input('estado', sql.NVarChar, estado)
    .query(`
      UPDATE usuarios
      SET estado = @estado
      OUTPUT INSERTED.id, INSERTED.nombre, INSERTED.estado
      WHERE id = @id
    `);
  return result.recordset[0];
};

const tieneHistorial = async (id) => {
  const pool = await getConnection();
  const result = await pool.request()
    .input('id', sql.Int, id)
    .query(`
      SELECT COUNT(*) AS total
      FROM contratos
      WHERE cliente_id = @id
    `);
  return result.recordset[0].total > 0;
};

const buscarPorNit = async (nit) => {
  const pool = await getConnection();
  const result = await pool.request()
    .input('nit', sql.NVarChar, nit)
    .query(`
      SELECT id, nit, nombre, tipo_usuario, estado
      FROM usuarios
      WHERE nit = @nit
    `);
  return result.recordset[0];
};

module.exports = {
  buscarPorId,
  listarUsuarios,
  actualizarUsuario,
  cambiarEstado,
  tieneHistorial,
  buscarPorNit
};