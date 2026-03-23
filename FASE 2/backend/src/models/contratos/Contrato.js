// models/contratos/Contrato.js
const sql = require('mssql');
const { getConnection } = require('../../config/database');

const crearContrato = async (datos) => {
  const {
    numero_contrato, cliente_id, fecha_inicio, fecha_fin,
    limite_credito, plazo_pago, creado_por
  } = datos;

  const pool = await getConnection();
  const result = await pool.request()
    .input('numero_contrato', sql.NVarChar,     numero_contrato)
    .input('cliente_id',      sql.Int,          cliente_id)
    .input('fecha_inicio',    sql.Date,         fecha_inicio)
    .input('fecha_fin',       sql.Date,         fecha_fin)
    .input('limite_credito',  sql.Decimal(15,2), limite_credito)
    .input('plazo_pago',      sql.Int,          plazo_pago)
    .input('creado_por',      sql.Int,          creado_por)
    .query(`
      INSERT INTO contratos
        (numero_contrato, cliente_id, fecha_inicio, fecha_fin,
         limite_credito, plazo_pago, creado_por)
      OUTPUT INSERTED.*
      VALUES
        (@numero_contrato, @cliente_id, @fecha_inicio, @fecha_fin,
         @limite_credito, @plazo_pago, @creado_por)
    `);
  return result.recordset[0];
};

const buscarPorId = async (id) => {
  const pool = await getConnection();
  const result = await pool.request()
    .input('id', sql.Int, id)
    .query(`
      SELECT c.*,
             u.nombre  AS cliente_nombre,
             u.nit     AS cliente_nit,
             cr.nombre AS creado_por_nombre,
             mo.nombre AS modificado_por_nombre
      FROM contratos c
      LEFT JOIN usuarios u  ON u.id  = c.cliente_id
      LEFT JOIN usuarios cr ON cr.id = c.creado_por
      LEFT JOIN usuarios mo ON mo.id = c.modificado_por
      WHERE c.id = @id
    `);
  return result.recordset[0];
};

const listarPorCliente = async (cliente_id) => {
  const pool = await getConnection();
  const result = await pool.request()
    .input('cliente_id', sql.Int, cliente_id)
    .query(`
      SELECT c.id, c.numero_contrato, c.fecha_inicio, c.fecha_fin,
             c.estado, c.limite_credito, c.saldo_usado,
             c.plazo_pago, c.fecha_creacion
      FROM contratos c
      WHERE c.cliente_id = @cliente_id
      ORDER BY c.fecha_creacion DESC
    `);
  return result.recordset;
};

const buscarVigentePorCliente = async (cliente_id) => {
  const pool = await getConnection();
  const result = await pool.request()
    .input('cliente_id', sql.Int, cliente_id)
    .query(`
      SELECT TOP 1
        c.id, c.numero_contrato, c.fecha_inicio, c.fecha_fin,
        c.estado, c.limite_credito, c.saldo_usado, c.plazo_pago
      FROM contratos c
      WHERE c.cliente_id = @cliente_id
        AND c.estado      = 'VIGENTE'
        AND c.fecha_fin  >= CAST(GETDATE() AS DATE)
      ORDER BY c.fecha_fin DESC
    `);
  return result.recordset[0];
};

const actualizarContrato = async (id, datos) => {
  const {
    fecha_inicio, fecha_fin, limite_credito,
    plazo_pago, estado, modificado_por
  } = datos;

  const pool = await getConnection();
  const result = await pool.request()
    .input('id',             sql.Int,          id)
    .input('fecha_inicio',   sql.Date,         fecha_inicio)
    .input('fecha_fin',      sql.Date,         fecha_fin)
    .input('limite_credito', sql.Decimal(15,2), limite_credito)
    .input('plazo_pago',     sql.Int,          plazo_pago)
    .input('estado',         sql.NVarChar,     estado)
    .input('modificado_por', sql.Int,          modificado_por)
    .query(`
      UPDATE contratos
      SET fecha_inicio       = @fecha_inicio,
          fecha_fin          = @fecha_fin,
          limite_credito     = @limite_credito,
          plazo_pago         = @plazo_pago,
          estado             = @estado,
          modificado_por     = @modificado_por,
          fecha_modificacion = GETDATE()
      OUTPUT INSERTED.*
      WHERE id = @id
    `);
  return result.recordset[0];
};

const actualizarSaldo = async (id, saldo_usado) => {
  const pool = await getConnection();
  const result = await pool.request()
    .input('id',          sql.Int,          id)
    .input('saldo_usado', sql.Decimal(15,2), saldo_usado)
    .query(`
      UPDATE contratos
      SET saldo_usado = @saldo_usado
      OUTPUT INSERTED.id, INSERTED.saldo_usado, INSERTED.limite_credito
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
      UPDATE contratos
      SET estado = @estado
      OUTPUT INSERTED.id, INSERTED.estado
      WHERE id = @id
    `);
  return result.recordset[0];
};

module.exports = {
  crearContrato,
  buscarPorId,
  listarPorCliente,
  buscarVigentePorCliente,
  actualizarContrato,
  actualizarSaldo,
  cambiarEstado
};