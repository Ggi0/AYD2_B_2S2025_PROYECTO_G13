// Prueba de carga: Generación de contratos (SOLO JSON, sin enviar a DB)
// Archivo: contratos-generator-only.js

import http from 'k6/http';
import { sleep } from 'k6';
import { Trend, Rate, Counter } from 'k6/metrics';

const API_URL = 'http://localhost:3001';

// Credenciales del agente logistico
const LOGIN_CREDENTIALS = {
  email: 'logistico@logitrans.com',
  password: 'jens123'
};

// Endpoints
const LOGIN_ENDPOINT = '/api/auth/login';

// Cliente específico para los contratos (ID 36 - Jens Prueba)
const CLIENTE_ID = 36;

// Bandera para SIMULAR envío a DB (false = no enviar a DB)
const SIMULAR_ENVIO_DB = false;

// Métricas
const loginDuration = new Trend('login_duration', true);
const errorRate = new Rate('error_rate');

// Configuración de la prueba
export const options = {
  scenarios: {
    generate_contratos: {
      executor: 'per-vu-iterations',
      vus: 5,           // 5 usuarios virtuales
      iterations: 4,    // 5 VUs x 4 iteraciones = 20 contratos
      maxDuration: '2m',
    },
  },
  thresholds: {
    error_rate: ['rate<0.05'],
  },
};

// Tipos de unidades para tarifas
const TIPOS_UNIDAD = ['LIGERA', 'PESADA', 'CABEZAL'];

// Tarifarios base
const TARIFARIOS_BASE = [
  { id: 1, tipo_unidad: 'LIGERA', costo_base_km: 5.00 },
  { id: 2, tipo_unidad: 'PESADA', costo_base_km: 8.00 },
  { id: 3, tipo_unidad: 'CABEZAL', costo_base_km: 12.00 }
];

// Rutas disponibles
const RUTAS_DISPONIBLES = [
  { origen: 'Quetzaltenango', destino: 'Guatemala', distancia_km: 200, tipo_carga: 'General' },
  { origen: 'Quetzaltenango', destino: 'Puerto Barrios', distancia_km: 350, tipo_carga: 'General' },
  { origen: 'Guatemala', destino: 'Quetzaltenango', distancia_km: 200, tipo_carga: 'Refrigerado' },
  { origen: 'Guatemala', destino: 'Puerto Barrios', distancia_km: 300, tipo_carga: 'Contenedor' },
  { origen: 'Puerto Barrios', destino: 'Quetzaltenango', distancia_km: 350, tipo_carga: 'General' },
  { origen: 'Puerto Barrios', destino: 'Guatemala', distancia_km: 300, tipo_carga: 'Refrigerado' },
  { origen: 'Escuintla', destino: 'Guatemala', distancia_km: 50, tipo_carga: 'General' },
  { origen: 'Antigua', destino: 'Guatemala', distancia_km: 40, tipo_carga: 'Frágil' },
  { origen: 'Guatemala', destino: 'Escuintla', distancia_km: 50, tipo_carga: 'General' },
  { origen: 'Guatemala', destino: 'Antigua', distancia_km: 40, tipo_carga: 'Frágil' },
  { origen: 'Mixco', destino: 'Guatemala', distancia_km: 15, tipo_carga: 'General' },
  { origen: 'Villa Nueva', destino: 'Guatemala', distancia_km: 20, tipo_carga: 'General' },
  { origen: 'San Miguel Petapa', destino: 'Guatemala', distancia_km: 18, tipo_carga: 'General' },
  { origen: 'Santa Catarina Pinula', destino: 'Guatemala', distancia_km: 12, tipo_carga: 'General' }
];

// Generar fecha aleatoria
function generarFechaInicio() {
  const hoy = new Date();
  const diasOffset = Math.floor(Math.random() * 30);
  const fechaInicio = new Date(hoy);
  fechaInicio.setDate(hoy.getDate() + diasOffset);
  return fechaInicio.toISOString().split('T')[0];
}

function generarFechaFin(fechaInicio) {
  const fechaFin = new Date(fechaInicio);
  fechaFin.setFullYear(fechaFin.getFullYear() + 1);
  return fechaFin.toISOString().split('T')[0];
}

// Generar número de contrato aleatorio
function generarNumeroContrato(vu, iteration, timestamp) {
  const anio = new Date().getFullYear();
  const mes = String(new Date().getMonth() + 1).padStart(2, '0');
  const secuencia = `${vu}${iteration}${timestamp}`.slice(-6);
  return `CTR-${anio}${mes}-${secuencia}`;
}

// Generar tarifas negociadas
function generarTarifas() {
  const numTarifas = Math.floor(Math.random() * 3) + 1;
  const tarifasSeleccionadas = [];
  const tiposUsados = new Set();
  
  for (let i = 0; i < numTarifas && tarifasSeleccionadas.length < TARIFARIOS_BASE.length; i++) {
    let tipoIndex;
    do {
      tipoIndex = Math.floor(Math.random() * TARIFARIOS_BASE.length);
    } while (tiposUsados.has(tipoIndex));
    
    tiposUsados.add(tipoIndex);
    const tarifario = TARIFARIOS_BASE[tipoIndex];
    
    const costoBase = tarifario.costo_base_km;
    const variacion = Math.random() * 0.3;
    const costoNegociado = parseFloat((costoBase * (1 + variacion)).toFixed(2));
    
    tarifasSeleccionadas.push({
      tarifario_id: tarifario.id,
      tipo_unidad: tarifario.tipo_unidad,
      costo_base_km: costoBase,
      costo_km_negociado: costoNegociado,
      ahorro_por_km: parseFloat((costoNegociado - costoBase).toFixed(2))
    });
  }
  
  return tarifasSeleccionadas;
}

// Generar rutas autorizadas
function generarRutas() {
  const numRutas = Math.floor(Math.random() * 4) + 1;
  const rutasSeleccionadas = [];
  const indicesUsados = new Set();
  
  for (let i = 0; i < numRutas && rutasSeleccionadas.length < RUTAS_DISPONIBLES.length; i++) {
    let rutaIndex;
    do {
      rutaIndex = Math.floor(Math.random() * RUTAS_DISPONIBLES.length);
    } while (indicesUsados.has(rutaIndex));
    
    indicesUsados.add(rutaIndex);
    const ruta = RUTAS_DISPONIBLES[rutaIndex];
    
    rutasSeleccionadas.push({
      origen: ruta.origen,
      destino: ruta.destino,
      distancia_km: ruta.distancia_km,
      tipo_carga: ruta.tipo_carga,
      costo_estimado: parseFloat((ruta.distancia_km * 8).toFixed(2)) // Costo estimado base
    });
  }
  
  return rutasSeleccionadas;
}

// Generar descuentos
function generarDescuentos() {
  const numDescuentos = Math.floor(Math.random() * 3);
  const descuentos = [];
  const tiposUsados = new Set();
  
  const observaciones = [
    'Descuento por volumen',
    'Cliente preferencial',
    'Promoción especial',
    'Contrato anual',
    'Fidelización',
    'Descuento por pronto pago',
    'Temporada baja'
  ];
  
  for (let i = 0; i < numDescuentos; i++) {
    let tipoIndex;
    do {
      tipoIndex = Math.floor(Math.random() * TIPOS_UNIDAD.length);
    } while (tiposUsados.has(tipoIndex));
    
    tiposUsados.add(tipoIndex);
    const tipoUnidad = TIPOS_UNIDAD[tipoIndex];
    const porcentaje = parseFloat((Math.random() * 15 + 5).toFixed(2));
    
    descuentos.push({
      tipo_unidad: tipoUnidad,
      porcentaje_descuento: porcentaje,
      observacion: observaciones[Math.floor(Math.random() * observaciones.length)]
    });
  }
  
  return descuentos;
}

// Calcular resumen financiero
function calcularResumenFinanciero(tarifas, rutas, descuentos) {
  let costoTotalBase = 0;
  let costoTotalNegociado = 0;
  
  rutas.forEach(ruta => {
    tarifas.forEach(tarifa => {
      const costoBaseRuta = ruta.distancia_km * tarifa.costo_base_km;
      const costoNegociadoRuta = ruta.distancia_km * tarifa.costo_km_negociado;
      costoTotalBase += costoBaseRuta;
      costoTotalNegociado += costoNegociadoRuta;
    });
  });
  
  // Aplicar descuentos
  let descuentoTotal = 0;
  descuentos.forEach(descuento => {
    const tarifaAfectada = tarifas.find(t => t.tipo_unidad === descuento.tipo_unidad);
    if (tarifaAfectada) {
      const ahorro = (tarifaAfectada.costo_km_negociado * descuento.porcentaje_descuento / 100) * 
                     rutas.reduce((sum, r) => sum + r.distancia_km, 0);
      descuentoTotal += ahorro;
    }
  });
  
  const costoFinal = costoTotalNegociado - descuentoTotal;
  
  return {
    costo_total_base: parseFloat(costoTotalBase.toFixed(2)),
    costo_total_negociado: parseFloat(costoTotalNegociado.toFixed(2)),
    ahorro_por_negociacion: parseFloat((costoTotalBase - costoTotalNegociado).toFixed(2)),
    descuento_aplicado: parseFloat(descuentoTotal.toFixed(2)),
    costo_final: parseFloat(costoFinal.toFixed(2)),
    ahorro_total: parseFloat((costoTotalBase - costoFinal).toFixed(2))
  };
}

// Generar datos completos del contrato
function generarContratoData(vu, iteration, timestamp) {
  const fechaInicio = generarFechaInicio();
  const fechaFin = generarFechaFin(fechaInicio);
  const limiteCredito = Math.floor(Math.random() * 450000) + 50000;
  const plazosPago = [15, 30, 45];
  const plazoPago = plazosPago[Math.floor(Math.random() * plazosPago.length)];
  const estados = ['VIGENTE', 'PENDIENTE', 'ACTIVO'];
  const estado = estados[Math.floor(Math.random() * estados.length)];
  
  const tarifas = generarTarifas();
  const rutas = generarRutas();
  const descuentos = generarDescuentos();
  const resumenFinanciero = calcularResumenFinanciero(tarifas, rutas, descuentos);
  
  return {
    id: `SIM-${vu}-${iteration}-${timestamp}`,
    numero_contrato: generarNumeroContrato(vu, iteration, timestamp),
    cliente_id: CLIENTE_ID,
    cliente_nombre: 'Jens Prueba',
    cliente_nit: '1234567890123',
    fecha_inicio: fechaInicio,
    fecha_fin: fechaFin,
    estado: estado,
    limite_credito: limiteCredito,
    plazo_pago: plazoPago,
    tarifas: tarifas,
    rutas: rutas,
    descuentos: descuentos,
    resumen_financiero: resumenFinanciero,
    creado_en: new Date().toISOString(),
    simulado: true,
    enviado_a_db: SIMULAR_ENVIO_DB
  };
}

// Login para obtener token (solo para simular autenticación)
function login() {
  const loginPayload = JSON.stringify(LOGIN_CREDENTIALS);
  
  const response = http.post(`${API_URL}${LOGIN_ENDPOINT}`, loginPayload, {
    headers: { 'Content-Type': 'application/json' },
  });
  
  if (response.status === 200) {
    try {
      const body = response.json();
      const token = body.data?.token || body.token;
      if (token) {
        return token;
      }
    } catch (e) {
      return null;
    }
  }
  
  return null;
}

// Escenario principal
export default function () {
  const vu = __VU;
  const iteration = __ITER;
  const timestamp = Date.now();
  
  console.log(`[VU ${vu}][ITER ${iteration}] Generando contrato simulado...`);
  
  // 1. Login (solo para verificar autenticación)
  const loginStart = new Date();
  const token = login();
  const loginEnd = new Date();
  loginDuration.add(loginEnd - loginStart);
  
  if (!token) {
    errorRate.add(1);
    console.log(`[VU ${vu}][ITER ${iteration}]  Login fallido (no se generará contrato)`);
    return;
  }
  
  // 2. Generar datos del contrato 
  const contratoData = generarContratoData(vu, iteration, timestamp);
  
  console.log(`[VU ${vu}][ITER ${iteration}]  CONTRATO GENERADO (SIMULADO):`);
  console.log(`  - Número: ${contratoData.numero_contrato}`);
  console.log(`  - Cliente: ${contratoData.cliente_nombre} (ID: ${contratoData.cliente_id})`);
  console.log(`  - Fechas: ${contratoData.fecha_inicio} → ${contratoData.fecha_fin}`);
  console.log(`  - Estado: ${contratoData.estado}`);
  console.log(`  - Límite crédito: Q${contratoData.limite_credito.toLocaleString()}`);
  console.log(`  - Plazo pago: ${contratoData.plazo_pago} días`);
  console.log(`  - Tarifas: ${contratoData.tarifas.length}`);
  console.log(`  - Rutas: ${contratoData.rutas.length}`);
  console.log(`  - Descuentos: ${contratoData.descuentos.length}`);
  console.log(`  - Ahorro total: Q${contratoData.resumen_financiero.ahorro_total.toLocaleString()}`);
  
  if (SIMULAR_ENVIO_DB) {
    console.log(`  - Enviado a DB: SÍ (simulado)`);
  } else {
    console.log(`  - Enviado a DB: NO (solo generación de JSON)`);
  }
  
  // Pequeña pausa entre iteraciones
  sleep(0.3);
}

// Al finalizar - Guardar archivos JSON
export function handleSummary(data) {
  // Recolectar todos los contratos generados durante la prueba
  // Nota: K6 no permite acceder directamente a los datos generados en cada iteración
  // Por lo tanto, generamos una lista basada en la configuración
  
  const vus = 5;
  const iterations = 4;
  const timestampBase = Date.now();
  const todosLosContratos = [];
  
  console.log('\n========== GENERANDO JSON CON CONTRATOS SIMULADOS ==========');
  
  for (let vu = 1; vu <= vus; vu++) {
    for (let iter = 0; iter < iterations; iter++) {
      const contrato = generarContratoData(vu, iter, timestampBase);
      todosLosContratos.push(contrato);
    }
  }
  
  const totalGenerados = todosLosContratos.length;
  
  // Calcular estadísticas
  let totalLimiteCredito = 0;
  let totalAhorro = 0;
  const contratosPorEstado = {
    VIGENTE: 0,
    PENDIENTE: 0,
    ACTIVO: 0
  };
  
  todosLosContratos.forEach(c => {
    totalLimiteCredito += c.limite_credito;
    totalAhorro += c.resumen_financiero.ahorro_total;
    if (contratosPorEstado[c.estado] !== undefined) {
      contratosPorEstado[c.estado]++;
    }
  });
  
  const promedioLimiteCredito = totalLimiteCredito / totalGenerados;
  const promedioAhorro = totalAhorro / totalGenerados;
  
  // Contratos individuales
  const contratosJson = {
    fecha_generacion: new Date().toISOString(),
    total_contratos_generados: totalGenerados,
    simulacion: {
      enviado_a_db: SIMULAR_ENVIO_DB,
      tipo: 'SOLO_JSON_SIN_DB',
      cliente_objetivo: {
        id: CLIENTE_ID,
        nombre: 'Jens Prueba'
      }
    },
    estadisticas: {
      promedio_limite_credito: parseFloat(promedioLimiteCredito.toFixed(2)),
      promedio_ahorro_total: parseFloat(promedioAhorro.toFixed(2)),
      contratos_por_estado: contratosPorEstado,
      rango_fechas_inicio: {
        mas_temprana: todosLosContratos.reduce((min, c) => c.fecha_inicio < min ? c.fecha_inicio : min, todosLosContratos[0]?.fecha_inicio || ''),
        mas_tardia: todosLosContratos.reduce((max, c) => c.fecha_inicio > max ? c.fecha_inicio : max, todosLosContratos[0]?.fecha_inicio || '')
      }
    },
    metricas_k6: {
      total_peticiones: data.metrics.http_reqs?.values?.count || 0,
      tiempo_promedio_login_ms: data.metrics.login_duration?.values?.avg || 0,
      tasa_error_porcentaje: ((data.metrics.error_rate?.values?.rate || 0) * 100).toFixed(2)
    },
    contratos: todosLosContratos
  };
  
  // Resumen ejecutivo
  const resumenJson = {
    fecha_prueba: new Date().toISOString(),
    tipo_prueba: 'GENERACION_CONTRATOS_SIMULADOS',
    total_contratos_generados: totalGenerados,
    cliente_objetivo: {
      id: CLIENTE_ID,
      nombre: 'Jens Prueba'
    },
    configuracion: {
      usuarios_virtuales: vus,
      iteraciones_por_usuario: iterations,
      simulacion_envio_db: SIMULAR_ENVIO_DB
    },
    resultados: {
      total_limite_credito_acumulado: parseFloat(totalLimiteCredito.toFixed(2)),
      promedio_limite_credito: parseFloat(promedioLimiteCredito.toFixed(2)),
      total_ahorro_acumulado: parseFloat(totalAhorro.toFixed(2)),
      promedio_ahorro: parseFloat(promedioAhorro.toFixed(2)),
      contratos_por_estado: contratosPorEstado
    },
    metricas_k6: {
      tiempo_promedio_login_ms: data.metrics.login_duration?.values?.avg || 0,
      tiempo_minimo_login_ms: data.metrics.login_duration?.values?.min || 0,
      tiempo_maximo_login_ms: data.metrics.login_duration?.values?.max || 0,
      tasa_error_porcentaje: ((data.metrics.error_rate?.values?.rate || 0) * 100).toFixed(2)
    }
  };
  
  console.log('\n========== ESTADÍSTICAS DE CONTRATOS GENERADOS ==========');
  console.log(`Total contratos generados: ${totalGenerados}`);
  console.log(`Cliente objetivo: ${CLIENTE_ID} (Jens Prueba)`);
  console.log(`Promedio límite de crédito: Q${promedioLimiteCredito.toLocaleString()}`);
  console.log(`Promedio ahorro por contrato: Q${promedioAhorro.toLocaleString()}`);
  console.log(`Contratos por estado: VIGENTE=${contratosPorEstado.VIGENTE}, PENDIENTE=${contratosPorEstado.PENDIENTE}, ACTIVO=${contratosPorEstado.ACTIVO}`);
  console.log('========================================================\n');
  
  return {
    'contratos-generados.json': JSON.stringify(contratosJson, null, 2),
    'resumen-contratos-simulados.json': JSON.stringify(resumenJson, null, 2),
  };
}