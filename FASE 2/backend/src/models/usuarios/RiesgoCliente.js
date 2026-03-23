// models/usuarios/RiesgoCliente.js
const sql = require('mssql');
const { getConnection } = require('../../config/database');

const crearRiesgo = async (datos) => {
  const {
    usuario_id, riesgo_capacidad_pago, riesgo_lavado_dinero,
    riesgo_aduanas, riesgo_mercancia, evaluado_por
  } = datos;

  const pool = await getConnection();
  const result = await pool.request()
    .input('usuario_id',            sql.Int,      usuario_id)
    .input('riesgo_capacidad_pago', sql.NVarChar, riesgo_capacidad_pago)
    .input('riesgo_lavado_dinero',  sql.NVarChar, riesgo_lavado_dinero)
    .input('riesgo_aduanas',        sql.NVarChar, riesgo_aduanas)
    .input('riesgo_mercancia',      sql.NVarChar, riesgo_mercancia)
    .input('evaluado_por',          sql.Int,      evaluado_por)
    .query(`
      INSERT INTO riesgo_cliente
        (usuario_id, riesgo_capacidad_pago, riesgo_lavado_dinero,
         riesgo_aduanas, riesgo_mercancia, evaluado_por)
      OUTPUT INSERTED.*
      VALUES
        (@usuario_id, @riesgo_capacidad_pago, @riesgo_lavado_dinero,
         @riesgo_aduanas, @riesgo_mercancia, @evaluado_por)
    `);
  return result.recordset[0];
};

const buscarPorCliente = async (usuario_id) => {
  const pool = await getConnection();
  const result = await pool.request()
    .input('usuario_id', sql.Int, usuario_id)
    .query(`
      SELECT r.*, u.nombre AS evaluado_por_nombre
      FROM riesgo_cliente r
      LEFT JOIN usuarios u ON u.id = r.evaluado_por
      WHERE r.usuario_id = @usuario_id
    `);
  return result.recordset[0];
};

const actualizarRiesgo = async (usuario_id, datos) => {
  const {
    riesgo_capacidad_pago, riesgo_lavado_dinero,
    riesgo_aduanas, riesgo_mercancia, evaluado_por
  } = datos;

  const pool = await getConnection();
  const result = await pool.request()
    .input('usuario_id',            sql.Int,      usuario_id)
    .input('riesgo_capacidad_pago', sql.NVarChar, riesgo_capacidad_pago)
    .input('riesgo_lavado_dinero',  sql.NVarChar, riesgo_lavado_dinero)
    .input('riesgo_aduanas',        sql.NVarChar, riesgo_aduanas)
    .input('riesgo_mercancia',      sql.NVarChar, riesgo_mercancia)
    .input('evaluado_por',          sql.Int,      evaluado_por)
    .query(`
      UPDATE riesgo_cliente
      SET riesgo_capacidad_pago = @riesgo_capacidad_pago,
          riesgo_lavado_dinero  = @riesgo_lavado_dinero,
          riesgo_aduanas        = @riesgo_aduanas,
          riesgo_mercancia      = @riesgo_mercancia,
          evaluado_por          = @evaluado_por,
          fecha_evaluacion      = GETDATE()
      OUTPUT INSERTED.*
      WHERE usuario_id = @usuario_id
    `);
  return result.recordset[0];
};

module.exports = { crearRiesgo, buscarPorCliente, actualizarRiesgo };