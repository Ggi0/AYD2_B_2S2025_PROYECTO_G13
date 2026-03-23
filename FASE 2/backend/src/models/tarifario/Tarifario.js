// models/tarifario/Tarifario.js
const sql = require('mssql');
const { getConnection } = require('../../config/database');

const listarTarifario = async () => {
  const pool = await getConnection();
  const result = await pool.request()
    .query(`
      SELECT t.id, t.tipo_unidad, t.limite_peso_ton,
             t.costo_base_km, t.activo, t.fecha_actualizacion,
             u.nombre AS actualizado_por_nombre
      FROM tarifario t
      LEFT JOIN usuarios u ON u.id = t.actualizado_por
      WHERE t.activo = 1
      ORDER BY t.tipo_unidad
    `);
  return result.recordset;
};

const buscarPorTipo = async (tipo_unidad) => {
  const pool = await getConnection();
  const result = await pool.request()
    .input('tipo_unidad', sql.NVarChar, tipo_unidad)
    .query(`
      SELECT id, tipo_unidad, limite_peso_ton, costo_base_km, activo
      FROM tarifario
      WHERE tipo_unidad = @tipo_unidad AND activo = 1
    `);
  return result.recordset[0];
};

const actualizarTarifa = async (tipo_unidad, datos) => {
  const { limite_peso_ton, costo_base_km, actualizado_por } = datos;
  const pool = await getConnection();
  const result = await pool.request()
    .input('tipo_unidad',     sql.NVarChar,     tipo_unidad)
    .input('limite_peso_ton', sql.Decimal(5,2),  limite_peso_ton)
    .input('costo_base_km',   sql.Decimal(10,2), costo_base_km)
    .input('actualizado_por', sql.Int,           actualizado_por)
    .query(`
      UPDATE tarifario
      SET limite_peso_ton     = @limite_peso_ton,
          costo_base_km       = @costo_base_km,
          actualizado_por     = @actualizado_por,
          fecha_actualizacion = GETDATE()
      OUTPUT INSERTED.*
      WHERE tipo_unidad = @tipo_unidad
    `);
  return result.recordset[0];
};

module.exports = { listarTarifario, buscarPorTipo, actualizarTarifa };