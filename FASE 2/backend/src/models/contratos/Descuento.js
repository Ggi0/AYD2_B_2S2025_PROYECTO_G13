// models/contratos/Descuento.js
const sql = require('mssql');
const { getConnection } = require('../../config/database');

const crearDescuento = async (datos) => {
  const { contrato_id, tipo_unidad, porcentaje_descuento, autorizado_por, observacion } = datos;
  const pool = await getConnection();
  const result = await pool.request()
    .input('contrato_id',          sql.Int,         contrato_id)
    .input('tipo_unidad',          sql.NVarChar,    tipo_unidad)
    .input('porcentaje_descuento', sql.Decimal(5,2), porcentaje_descuento)
    .input('autorizado_por',       sql.Int,         autorizado_por)
    .input('observacion',          sql.NVarChar,    observacion || null)
    .query(`
      INSERT INTO descuentos_contrato
        (contrato_id, tipo_unidad, porcentaje_descuento, autorizado_por, observacion)
      OUTPUT INSERTED.*
      VALUES
        (@contrato_id, @tipo_unidad, @porcentaje_descuento, @autorizado_por, @observacion)
    `);
  return result.recordset[0];
};

const listarPorContrato = async (contrato_id) => {
  const pool = await getConnection();
  const result = await pool.request()
    .input('contrato_id', sql.Int, contrato_id)
    .query(`
      SELECT d.*, u.nombre AS autorizado_por_nombre
      FROM descuentos_contrato d
      LEFT JOIN usuarios u ON u.id = d.autorizado_por
      WHERE d.contrato_id = @contrato_id
      ORDER BY d.tipo_unidad
    `);
  return result.recordset;
};

const buscarPorContratoYTipo = async (contrato_id, tipo_unidad) => {
  const pool = await getConnection();
  const result = await pool.request()
    .input('contrato_id', sql.Int,      contrato_id)
    .input('tipo_unidad', sql.NVarChar, tipo_unidad)
    .query(`
      SELECT d.id, d.tipo_unidad, d.porcentaje_descuento,
             d.observacion, d.fecha_autorizacion,
             u.nombre AS autorizado_por_nombre
      FROM descuentos_contrato d
      LEFT JOIN usuarios u ON u.id = d.autorizado_por
      WHERE d.contrato_id = @contrato_id
        AND d.tipo_unidad = @tipo_unidad
    `);
  return result.recordset[0];
};

const actualizarDescuento = async (id, datos) => {
  const { porcentaje_descuento, autorizado_por, observacion } = datos;
  const pool = await getConnection();
  const result = await pool.request()
    .input('id',                   sql.Int,         id)
    .input('porcentaje_descuento', sql.Decimal(5,2), porcentaje_descuento)
    .input('autorizado_por',       sql.Int,         autorizado_por)
    .input('observacion',          sql.NVarChar,    observacion || null)
    .query(`
      UPDATE descuentos_contrato
      SET porcentaje_descuento = @porcentaje_descuento,
          autorizado_por       = @autorizado_por,
          observacion          = @observacion,
          fecha_autorizacion   = GETDATE()
      OUTPUT INSERTED.*
      WHERE id = @id
    `);
  return result.recordset[0];
};

const eliminarDescuento = async (id) => {
  const pool = await getConnection();
  const result = await pool.request()
    .input('id', sql.Int, id)
    .query(`
      DELETE FROM descuentos_contrato
      OUTPUT DELETED.*
      WHERE id = @id
    `);
  return result.recordset[0];
};

module.exports = {
  crearDescuento,
  listarPorContrato,
  buscarPorContratoYTipo,
  actualizarDescuento,
  eliminarDescuento
};