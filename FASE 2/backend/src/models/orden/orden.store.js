"use strict";
const { sql, getConnection } = require("../../config/db");

async function obtenerContratoValido(cliente_id) {
  const pool = await getConnection();
  // CDU 002.7: Validar contrato vigente y saldo
  const result = await pool.request().input("cliente_id", sql.Int, cliente_id)
    .query(`
            SELECT TOP 1 id, limite_credito, saldo_usado
            FROM contratos 
            WHERE cliente_id = @cliente_id 
            AND estado = 'VIGENTE' 
            AND fecha_fin >= GETDATE()
        `);
  return result.recordset[0];
}

async function facturasVencidas(cliente_id) {
  const pool = await getConnection();
  const result = await pool.request().input("cliente_id", sql.Int, cliente_id)
    .query(`
            select 1
            from cuentas_por_cobrar
            where cliente_id = @cliente_id 
            AND estado_cobro = 'VENCIDA';
        `);
  return result.recordset[0];
}

async function tarifaCamion(contrato_id, peso_estimado) {
  const pool = await getConnection();
  const result = await pool
    .request()
    .input("contrato_id", sql.Int, contrato_id)
    .input("peso_estimado", sql.Decimal(5, 2), peso_estimado).query(`
        SELECT
            Top 1
            ISNULL(
                ct.costo_km_negociado,
                t.costo_base_km
            ) AS costo_km,
            t.tipo_unidad,
            t.limite_peso_ton
        FROM tarifario t
        LEFT JOIN contrato_tarifas ct ON ct.tarifario_id = t.id AND ct.contrato_id = @contrato_id
        WHERE @peso_estimado <= t.limite_peso_ton
        ORDER BY t.limite_peso_ton ASC;`);
  return result.recordset[0];
}

async function desplazaminetoAutorizado(contrato_id, origen, destino) {
  const pool = await getConnection();
  const result = await pool
    .request()
    .input("contrato_id", sql.Int, contrato_id)
    .input("origen", sql.NVarChar(100), origen)
    .input("destino", sql.NVarChar(100), destino)
    .query(
      `select distancia_km
        from rutas_autorizadas
        where contrato_id = @contrato_id
        and origen like @origen
        and destino like @destino;`,
    );
  return result.recordset[0];
}

async function insertarOrden(datos) {
  const pool = await getConnection();

  const numeroOrden = `ORD-${Date.now()}`;

  const result = await pool
    .request()
    .input("numero_orden", sql.NVarChar, numeroOrden)
    .input("cliente_id", sql.Int, datos.cliente_id)
    .input("contrato_id", sql.Int, datos.contrato_id)
    .input("origen", sql.NVarChar, datos.origen)
    .input("destino", sql.NVarChar, datos.destino)
    .input("tipo_mercancia", sql.NVarChar, datos.tipo_mercancia)
    .input("peso_estimado", sql.Decimal(10, 2), datos.peso_estimado)
    .input("costo", sql.Decimal(10, 2), datos.costo)
    .input("creado_por", sql.Int, datos.creado_por).query(`
      BEGIN TRANSACTION;
      BEGIN TRY
        -- 1. Insertar la nueva orden
        INSERT INTO ordenes (
            numero_orden, cliente_id, contrato_id, origen, destino, 
            tipo_mercancia, peso_estimado, costo, creado_por, estado
        )
        VALUES (
            @numero_orden, @cliente_id, @contrato_id, @origen, @destino, 
            @tipo_mercancia, @peso_estimado, @costo, @creado_por, 'PENDIENTE_PLANIFICACION'
        );

        -- 2. Actualizar el saldo usado en el contrato
        UPDATE contratos
        SET saldo_usado = saldo_usado + @costo
        WHERE id = @contrato_id;

        COMMIT TRANSACTION;

        -- 3. Retornar la orden recién creada
        SELECT * FROM ordenes WHERE numero_orden = @numero_orden;
      END TRY
      BEGIN CATCH
        ROLLBACK TRANSACTION;
        THROW; -- Lanza el error para que el service lo capture
      END CATCH
    `);

  return result.recordset[0];
}

async function obtenerOrdenes() {
  const pool = await getConnection();
  const result = await pool.request().query(
    `select id, 
              numero_orden,
              (select nombre from usuarios where ordenes.cliente_id = usuarios.id), 
              origen, 
              destino, 
              tipo_mercancia, 
              peso_estimado, 
              costo
        from ordenes
        where estado like 'PENDIENTE_PLANIFICACION';`,
  );

  return result;
}

async function vehiculoApto(vehiculo_id, peso_estimado) {
  const pool = await getConnection();
  const result = await pool
    .request()
    .input("vehiculo_id", sql.Int, vehiculo_id)
    .input("peso_estimado", sql.Decimal(10, 2), peso_estimado)
    .query(
      `select top 1 1
      from vehiculos
      where (select limite_peso_ton from tarifario where vehiculos.tarifario_id = tarifario.id) >= @peso_estimado
      AND vehiculos.estado like 'DISPONIBLE'
      AND vehiculos.id = @vehiculo_id
      AND vehiculos.activo = 1;`,
    );
  return result.recordset[0];
}

async function conductorApto(piloto_id) {
  const pool = await getConnection();
  const result = await pool
    .request()
    .input("piloto_id", sql.Int, piloto_id)
    .query(
      `select top 1 1
      from usuarios
      where id = @piloto_id
      AND tipo_usuario like 'PILOTO'
      AND estado like 'ACTIVO';`,
    );
  return result.recordset[0];
}

async function actualizarAsignacion(ordenId, datos) {
  const pool = await getConnection();
  const result = await pool
    .request()
    .input("id", sql.Int, ordenId)
    .input("piloto_id", sql.Int, datos.piloto_id)
    .input("vehiculo_id", sql.Int, datos.vehiculo_id).query(`
      BEGIN TRANSACTION;
      BEGIN TRY
        UPDATE ordenes
        SET vehiculo_id = @vehiculo_id, 
            piloto_id = @piloto_id,
            estado = 'PLANIFICADA'
        WHERE id = @id;

        UPDATE vehiculos
        SET estado = 'ASIGNADO'
        WHERE id = @vehiculo_id;

        COMMIT TRANSACTION;

        SELECT * FROM ordenes WHERE id = @id;
      END TRY
      BEGIN CATCH
        ROLLBACK TRANSACTION;
        THROW;
      END CATCH
    `);

  return result.recordset[0];
}

module.exports = {
  obtenerContratoValido,
  facturasVencidas,
  desplazaminetoAutorizado,
  tarifaCamion,
  insertarOrden,
  obtenerOrdenes,
  vehiculoApto,
  conductorApto,
  actualizarAsignacion,
};
