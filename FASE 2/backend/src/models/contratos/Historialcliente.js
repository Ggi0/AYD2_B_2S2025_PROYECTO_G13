// models/contratos/HistorialCliente.js
const sql = require('mssql');
const { getConnection } = require('../../config/database');

const crearHistorial = async (datos) => {
  const {
    cliente_id, orden_id, volumen_carga_ton, monto_facturado,
    gasto_operativo, pago_puntual, siniestro, descripcion_siniestro
  } = datos;

  const pool = await getConnection();
  const result = await pool.request()
    .input('cliente_id',            sql.Int,          cliente_id)
    .input('orden_id',              sql.Int,          orden_id)
    .input('volumen_carga_ton',     sql.Decimal(10,2), volumen_carga_ton)
    .input('monto_facturado',       sql.Decimal(15,2), monto_facturado)
    .input('gasto_operativo',       sql.Decimal(15,2), gasto_operativo)
    .input('pago_puntual',          sql.Bit,          pago_puntual)
    .input('siniestro',             sql.Bit,          siniestro || false)
    .input('descripcion_siniestro', sql.NVarChar,     descripcion_siniestro || null)
    .query(`
      INSERT INTO historial_cliente
        (cliente_id, orden_id, volumen_carga_ton, monto_facturado,
         gasto_operativo, pago_puntual, siniestro, descripcion_siniestro)
      OUTPUT INSERTED.*
      VALUES
        (@cliente_id, @orden_id, @volumen_carga_ton, @monto_facturado,
         @gasto_operativo, @pago_puntual, @siniestro, @descripcion_siniestro)
    `);
  return result.recordset[0];
};

const listarPorCliente = async (cliente_id) => {
  const pool = await getConnection();
  const result = await pool.request()
    .input('cliente_id', sql.Int, cliente_id)
    .query(`
      SELECT h.*, u.nombre AS cliente_nombre, u.nit AS cliente_nit
      FROM historial_cliente h
      LEFT JOIN usuarios u ON u.id = h.cliente_id
      WHERE h.cliente_id = @cliente_id
      ORDER BY h.fecha_registro DESC
    `);
  return result.recordset;
};

const resumenRentabilidad = async (cliente_id) => {
  const pool = await getConnection();
  const result = await pool.request()
    .input('cliente_id', sql.Int, cliente_id)
    .query(`
      SELECT
        u.nombre                              AS cliente_nombre,
        u.nit                                 AS cliente_nit,
        COUNT(h.id)                           AS total_ordenes,
        SUM(h.volumen_carga_ton)              AS total_volumen_ton,
        SUM(h.monto_facturado)                AS total_facturado,
        SUM(h.gasto_operativo)                AS total_gastos,
        SUM(h.monto_facturado)
          - SUM(h.gasto_operativo)            AS rentabilidad_total,
        SUM(CASE WHEN h.pago_puntual = 1
            THEN 1 ELSE 0 END)                AS pagos_puntuales,
        SUM(CASE WHEN h.siniestro = 1
            THEN 1 ELSE 0 END)                AS total_siniestros
      FROM historial_cliente h
      LEFT JOIN usuarios u ON u.id = h.cliente_id
      WHERE h.cliente_id = @cliente_id
      GROUP BY u.nombre, u.nit
    `);
  return result.recordset[0];
};

const resumenTodosClientes = async () => {
  const pool = await getConnection();
  const result = await pool.request()
    .query(`
      SELECT
        u.id                                  AS cliente_id,
        u.nombre                              AS cliente_nombre,
        u.nit                                 AS cliente_nit,
        COUNT(h.id)                           AS total_ordenes,
        SUM(h.volumen_carga_ton)              AS total_volumen_ton,
        SUM(h.monto_facturado)                AS total_facturado,
        SUM(h.gasto_operativo)                AS total_gastos,
        SUM(h.monto_facturado)
          - SUM(h.gasto_operativo)            AS rentabilidad_total
      FROM historial_cliente h
      LEFT JOIN usuarios u ON u.id = h.cliente_id
      GROUP BY u.id, u.nombre, u.nit
      ORDER BY rentabilidad_total DESC
    `);
  return result.recordset;
};

module.exports = {
  crearHistorial,
  listarPorCliente,
  resumenRentabilidad,
  resumenTodosClientes
};