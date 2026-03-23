// models/contratos/ContratoTarifa.js
const sql = require('mssql');
const { getConnection } = require('../../config/database');

const crearContratoTarifa = async (datos) => {
  const { contrato_id, tarifario_id, costo_km_negociado } = datos;
  const pool = await getConnection();
  const result = await pool.request()
    .input('contrato_id',        sql.Int,          contrato_id)
    .input('tarifario_id',       sql.Int,          tarifario_id)
    .input('costo_km_negociado', sql.Decimal(10,2), costo_km_negociado)
    .query(`
      INSERT INTO contrato_tarifas (contrato_id, tarifario_id, costo_km_negociado)
      OUTPUT INSERTED.*
      VALUES (@contrato_id, @tarifario_id, @costo_km_negociado)
    `);
  return result.recordset[0];
};

const listarPorContrato = async (contrato_id) => {
  const pool = await getConnection();
  const result = await pool.request()
    .input('contrato_id', sql.Int, contrato_id)
    .query(`
      SELECT ct.id, ct.contrato_id, ct.costo_km_negociado,
             t.tipo_unidad, t.limite_peso_ton, t.costo_base_km
      FROM contrato_tarifas ct
      INNER JOIN tarifario t ON t.id = ct.tarifario_id
      WHERE ct.contrato_id = @contrato_id
      ORDER BY t.tipo_unidad
    `);
  return result.recordset;
};

const buscarPorContratoYTipo = async (contrato_id, tipo_unidad) => {
  const pool = await getConnection();
  const result = await pool.request()
    .input('contrato_id', sql.Int,      contrato_id)
    .input('tipo_unidad', sql.NVarChar, tipo_unidad)
    .query(`
      SELECT ct.id, ct.costo_km_negociado,
             t.tipo_unidad, t.limite_peso_ton, t.costo_base_km
      FROM contrato_tarifas ct
      INNER JOIN tarifario t ON t.id = ct.tarifario_id
      WHERE ct.contrato_id = @contrato_id
        AND t.tipo_unidad  = @tipo_unidad
    `);
  return result.recordset[0];
};

const actualizarContratoTarifa = async (contrato_id, tarifario_id, costo_km_negociado) => {
  const pool = await getConnection();
  const result = await pool.request()
    .input('contrato_id',        sql.Int,          contrato_id)
    .input('tarifario_id',       sql.Int,          tarifario_id)
    .input('costo_km_negociado', sql.Decimal(10,2), costo_km_negociado)
    .query(`
      UPDATE contrato_tarifas
      SET costo_km_negociado = @costo_km_negociado
      OUTPUT INSERTED.*
      WHERE contrato_id = @contrato_id AND tarifario_id = @tarifario_id
    `);
  return result.recordset[0];
};

const eliminarContratoTarifa = async (contrato_id, tarifario_id) => {
  const pool = await getConnection();
  const result = await pool.request()
    .input('contrato_id',  sql.Int, contrato_id)
    .input('tarifario_id', sql.Int, tarifario_id)
    .query(`
      DELETE FROM contrato_tarifas
      OUTPUT DELETED.*
      WHERE contrato_id = @contrato_id AND tarifario_id = @tarifario_id
    `);
  return result.recordset[0];
};

module.exports = {
  crearContratoTarifa,
  listarPorContrato,
  buscarPorContratoYTipo,
  actualizarContratoTarifa,
  eliminarContratoTarifa
};