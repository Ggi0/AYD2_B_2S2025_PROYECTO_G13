"use strict";
const { sql, getConnection } = require("../../config/db");

async function obtenerContextoValidacion(cliente_id, origen, destino, peso) {
  const pool = await getConnection();
  const result = await pool
    .request()
    .input("cliente_id", sql.Int, cliente_id)
    .input("origen", sql.NVarChar, `%${origen}%`)
    .input("destino", sql.NVarChar, `%${destino}%`)
    .input("peso", sql.Decimal(10, 2), peso).query(`
      -- 1. Declarar y asignar la variable de forma aislada
      DECLARE @v_contrato_id INT;
      
      SET @v_contrato_id = (
          SELECT TOP 1 id 
          FROM contratos 
          WHERE cliente_id = @cliente_id 
            AND estado = 'VIGENTE' 
            AND fecha_fin >= GETDATE()
          ORDER BY fecha_inicio DESC
      );

      -- 2. Devolver los datos del contrato (Recordset 0)
      SELECT id, limite_credito, saldo_usado 
      FROM contratos 
      WHERE id = @v_contrato_id;

      -- 3. Facturas Vencidas (Recordset 1)
      SELECT COUNT(*) as vencidas 
      FROM cuentas_por_cobrar 
      WHERE cliente_id = @cliente_id AND estado_cobro = 'VENCIDA';

      -- 4. Ruta Autorizada (Recordset 2)
      SELECT TOP 1 distancia_km 
      FROM rutas_autorizadas 
      WHERE contrato_id = @v_contrato_id
        AND origen LIKE @origen 
        AND destino LIKE @destino;

      -- 5. Tarifa (Recordset 3)
      SELECT TOP 1 
          ISNULL(ct.costo_km_negociado, t.costo_base_km) AS costo_km
      FROM tarifario t
      LEFT JOIN contrato_tarifas ct ON ct.tarifario_id = t.id 
                                   AND ct.contrato_id = @v_contrato_id
      WHERE @peso <= t.limite_peso_ton
      ORDER BY t.limite_peso_ton ASC;
    `);

  return {
    contrato: result.recordsets[0][0] || null,
    facturasVencidas: result.recordsets[1][0]
      ? result.recordsets[1][0].vencidas
      : 0,
    ruta: result.recordsets[2][0] || null,
    tarifa: result.recordsets[3][0] || null,
  };
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

async function getVehiculos() {
  const pool = await getConnection();
  const result = await pool.request().query(`
    select id, placa, estado, tarifario_id
    from vehiculos
    where activo = 1
    and estado like 'DISPONIBLE';
    `);
  return result.recordset;
}

async function getPilotos() {
  const pool = await getConnection();
  const result = await pool.request().query(`
    select id, nombre, nit, email, telefono
    from usuarios
    where tipo_usuario like 'PILOTO'
    AND estado like 'ACTIVO';
    `);
  return result.recordset;
}

module.exports = {
  insertarOrden,
  obtenerOrdenes,
  vehiculoApto,
  conductorApto,
  actualizarAsignacion,
  obtenerContextoValidacion,
  getVehiculos,
  getPilotos,
};
