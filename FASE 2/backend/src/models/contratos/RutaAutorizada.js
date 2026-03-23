// models/contratos/RutaAutorizada.js
const sql = require('mssql');
const { getConnection } = require('../../config/database');

const crearRuta = async (datos) => {
  const { contrato_id, origen, destino, distancia_km, tipo_carga } = datos;
  const pool = await getConnection();
  const result = await pool.request()
    .input('contrato_id',  sql.Int,          contrato_id)
    .input('origen',       sql.NVarChar,     origen)
    .input('destino',      sql.NVarChar,     destino)
    .input('distancia_km', sql.Decimal(10,2), distancia_km || null)
    .input('tipo_carga',   sql.NVarChar,     tipo_carga || null)
    .query(`
      INSERT INTO rutas_autorizadas (contrato_id, origen, destino, distancia_km, tipo_carga)
      OUTPUT INSERTED.*
      VALUES (@contrato_id, @origen, @destino, @distancia_km, @tipo_carga)
    `);
  return result.recordset[0];
};

const listarPorContrato = async (contrato_id) => {
  const pool = await getConnection();
  const result = await pool.request()
    .input('contrato_id', sql.Int, contrato_id)
    .query(`
      SELECT id, contrato_id, origen, destino, distancia_km, tipo_carga, activa
      FROM rutas_autorizadas
      WHERE contrato_id = @contrato_id
      ORDER BY origen, destino
    `);
  return result.recordset;
};

const verificarRuta = async (contrato_id, origen, destino) => {
  const pool = await getConnection();
  const result = await pool.request()
    .input('contrato_id', sql.Int,      contrato_id)
    .input('origen',      sql.NVarChar, origen)
    .input('destino',     sql.NVarChar, destino)
    .query(`
      SELECT id, origen, destino, distancia_km, tipo_carga
      FROM rutas_autorizadas
      WHERE contrato_id = @contrato_id
        AND origen      = @origen
        AND destino     = @destino
        AND activa      = 1
    `);
  return result.recordset[0];
};

const cambiarEstadoRuta = async (id, activa) => {
  const pool = await getConnection();
  const result = await pool.request()
    .input('id',     sql.Int, id)
    .input('activa', sql.Bit, activa)
    .query(`
      UPDATE rutas_autorizadas
      SET activa = @activa
      OUTPUT INSERTED.*
      WHERE id = @id
    `);
  return result.recordset[0];
};

const eliminarRuta = async (id) => {
  const pool = await getConnection();
  const result = await pool.request()
    .input('id', sql.Int, id)
    .query(`
      DELETE FROM rutas_autorizadas
      OUTPUT DELETED.*
      WHERE id = @id
    `);
  return result.recordset[0];
};

module.exports = {
  crearRuta,
  listarPorContrato,
  verificarRuta,
  cambiarEstadoRuta,
  eliminarRuta
};