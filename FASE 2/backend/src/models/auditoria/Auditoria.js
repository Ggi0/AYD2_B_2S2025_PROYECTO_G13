// models/auditoria/Auditoria.js
const sql = require('mssql');
const { getConnection } = require('../../config/database');

const registrar = async (datos) => {
  const {
    tabla_afectada, accion, registro_id, usuario_id,
    descripcion, datos_anteriores, datos_nuevos, ip_origen
  } = datos;

  const pool = await getConnection();
  const result = await pool.request()
    .input('tabla_afectada',   sql.NVarChar, tabla_afectada)
    .input('accion',           sql.NVarChar, accion)
    .input('registro_id',      sql.Int,      registro_id)
    .input('usuario_id',       sql.Int,      usuario_id)
    .input('descripcion',      sql.NVarChar, descripcion || null)
    .input('datos_anteriores', sql.NVarChar, datos_anteriores ? JSON.stringify(datos_anteriores) : null)
    .input('datos_nuevos',     sql.NVarChar, datos_nuevos ? JSON.stringify(datos_nuevos) : null)
    .input('ip_origen',        sql.NVarChar, ip_origen || null)
    .query(`
      INSERT INTO auditoria
        (tabla_afectada, accion, registro_id, usuario_id,
         descripcion, datos_anteriores, datos_nuevos, ip_origen)
      OUTPUT INSERTED.*
      VALUES
        (@tabla_afectada, @accion, @registro_id, @usuario_id,
         @descripcion, @datos_anteriores, @datos_nuevos, @ip_origen)
    `);
  return result.recordset[0];
};

const listar = async (filtros = {}) => {
  const { tabla_afectada, accion, usuario_id, fecha_inicio, fecha_fin } = filtros;
  const pool = await getConnection();
  const request = pool.request();

  let query = `
    SELECT a.*, u.nombre AS usuario_nombre
    FROM auditoria a
    LEFT JOIN usuarios u ON u.id = a.usuario_id
    WHERE 1=1
  `;

  if (tabla_afectada) {
    query += ` AND a.tabla_afectada = @tabla_afectada`;
    request.input('tabla_afectada', sql.NVarChar, tabla_afectada);
  }
  if (accion) {
    query += ` AND a.accion = @accion`;
    request.input('accion', sql.NVarChar, accion);
  }
  if (usuario_id) {
    query += ` AND a.usuario_id = @usuario_id`;
    request.input('usuario_id', sql.Int, usuario_id);
  }
  if (fecha_inicio) {
    query += ` AND a.fecha_hora >= @fecha_inicio`;
    request.input('fecha_inicio', sql.DateTime2, new Date(fecha_inicio));
  }
  if (fecha_fin) {
    query += ` AND a.fecha_hora <= @fecha_fin`;
    request.input('fecha_fin', sql.DateTime2, new Date(fecha_fin));
  }

  query += ` ORDER BY a.fecha_hora DESC`;
  const result = await request.query(query);
  return result.recordset;
};

const listarPorRegistro = async (tabla_afectada, registro_id) => {
  const pool = await getConnection();
  const result = await pool.request()
    .input('tabla_afectada', sql.NVarChar, tabla_afectada)
    .input('registro_id',    sql.Int,      registro_id)
    .query(`
      SELECT a.*, u.nombre AS usuario_nombre
      FROM auditoria a
      LEFT JOIN usuarios u ON u.id = a.usuario_id
      WHERE a.tabla_afectada = @tabla_afectada
        AND a.registro_id    = @registro_id
      ORDER BY a.fecha_hora DESC
    `);
  return result.recordset;
};

module.exports = { registrar, listar, listarPorRegistro };