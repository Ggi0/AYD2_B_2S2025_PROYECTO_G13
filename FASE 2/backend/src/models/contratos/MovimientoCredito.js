// models/contratos/MovimientoCredito.js
const sql = require('mssql');
const { getConnection } = require('../../config/database');

const crearMovimiento = async (datos) => {
  const {
    contrato_id, factura_id, pago_id, tipo_movimiento,
    monto_movimiento, saldo_anterior, saldo_nuevo, motivo, registrado_por
  } = datos;

  const pool = await getConnection();
  const result = await pool.request()
    .input('contrato_id',      sql.Int,          contrato_id)
    .input('factura_id',       sql.Int,          factura_id)
    .input('pago_id',          sql.Int,          pago_id || null)
    .input('tipo_movimiento',  sql.NVarChar,     tipo_movimiento)
    .input('monto_movimiento', sql.Decimal(15,2), monto_movimiento)
    .input('saldo_anterior',   sql.Decimal(15,2), saldo_anterior)
    .input('saldo_nuevo',      sql.Decimal(15,2), saldo_nuevo)
    .input('motivo',           sql.NVarChar,     motivo)
    .input('registrado_por',   sql.Int,          registrado_por)
    .query(`
      INSERT INTO movimientos_credito_contrato
        (contrato_id, factura_id, pago_id, tipo_movimiento,
         monto_movimiento, saldo_anterior, saldo_nuevo, motivo, registrado_por)
      OUTPUT INSERTED.*
      VALUES
        (@contrato_id, @factura_id, @pago_id, @tipo_movimiento,
         @monto_movimiento, @saldo_anterior, @saldo_nuevo, @motivo, @registrado_por)
    `);
  return result.recordset[0];
};

const listarPorContrato = async (contrato_id) => {
  const pool = await getConnection();
  const result = await pool.request()
    .input('contrato_id', sql.Int, contrato_id)
    .query(`
      SELECT m.*, u.nombre AS registrado_por_nombre
      FROM movimientos_credito_contrato m
      LEFT JOIN usuarios u ON u.id = m.registrado_por
      WHERE m.contrato_id = @contrato_id
      ORDER BY m.fecha_movimiento DESC
    `);
  return result.recordset;
};

const ultimoMovimiento = async (contrato_id) => {
  const pool = await getConnection();
  const result = await pool.request()
    .input('contrato_id', sql.Int, contrato_id)
    .query(`
      SELECT TOP 1 saldo_nuevo, fecha_movimiento
      FROM movimientos_credito_contrato
      WHERE contrato_id = @contrato_id
      ORDER BY fecha_movimiento DESC
    `);
  return result.recordset[0];
};

module.exports = { crearMovimiento, listarPorContrato, ultimoMovimiento };