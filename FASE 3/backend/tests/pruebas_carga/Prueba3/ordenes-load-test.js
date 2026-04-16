// Prueba de carga: Generación de órdenes con control de crédito
// Archivo: ordenes-credito-test.js

import http from 'k6/http';
import { sleep } from 'k6';
import { Trend, Rate, Counter, Gauge } from 'k6/metrics';

const API_URL = 'http://localhost:3001';

// Credenciales del cliente específico
const LOGIN_CREDENTIALS = {
  email: 'probando@logitrans.com',
  password: '123456'
};

// Endpoints
const LOGIN_ENDPOINT = '/api/auth/login';
const CONTRATOS_ENDPOINT = '/api/contratos/cliente/36'; // ID fijo del cliente

// Datos del cliente (conocidos)
const CLIENTE_ID = 36;
const CLIENTE_NOMBRE = 'Jens Prueba';
const CLIENTE_EMAIL = LOGIN_CREDENTIALS.email;

// Rutas estáticas (solo estas dos)
const RUTAS = [
  { 
    id: 1, 
    origen: 'Puerto Barrios', 
    destino: 'Guatemala', 
    distancia_km: 300,
    tipo_carga: 'GENERAL',
    costo_por_km: 5.00,
    nombre: 'Puerto Barrios → Guatemala'
  },
  { 
    id: 2, 
    origen: 'Quetzaltenango', 
    destino: 'Guatemala', 
    distancia_km: 200,
    tipo_carga: 'GENERAL',
    costo_por_km: 5.00,
    nombre: 'Quetzaltenango → Guatemala'
  }
];

// Métricas
const loginDuration = new Trend('login_duration', true);
const getContratosDuration = new Trend('get_contratos_duration', true);
const errorRate = new Rate('error_rate');
const ordenesCreadas = new Counter('ordenes_creadas');
const creditosInsuficientesMetric = new Counter('creditos_insuficientes');

// Métricas para almacenar el estado final
const limiteTotalMetric = new Gauge('limite_total');
const saldoUsadoInicialMetric = new Gauge('saldo_usado_inicial');
const creditoDisponibleFinalMetric = new Gauge('credito_disponible_final');
const ordenesGeneradasTotal = new Gauge('ordenes_generadas_total');
const creditosInsuficientesTotal = new Gauge('creditos_insuficientes_total');
const totalNuevasOrdenesGastado = new Gauge('total_nuevas_ordenes_gastado');

// Configuración de la prueba
export const options = {
  scenarios: {
    generate_ordenes_credito: {
      executor: 'per-vu-iterations',
      vus: 1,
      iterations: 30,
      maxDuration: '2m',
    },
  },
};

// Variables que se acumularán
let ordenesGeneradasList = [];
let creditosInsuficientesCount = 0;
let limiteTotal = 0;
let saldoUsadoInicial = 0;
let creditoDisponible = 0;
let totalGastadoEnNuevasOrdenes = 0;
let inicializado = false;

// Login para obtener token
function login() {
  const loginStart = new Date();
  const loginPayload = JSON.stringify(LOGIN_CREDENTIALS);
  
  const response = http.post(`${API_URL}${LOGIN_ENDPOINT}`, loginPayload, {
    headers: { 'Content-Type': 'application/json' },
  });
  
  const loginEnd = new Date();
  loginDuration.add(loginEnd - loginStart);
  
  if (response.status === 200) {
    try {
      const body = response.json();
      const token = body.data?.token || body.token;
      if (token) {
        console.log(`✅ Login exitoso`);
        return token;
      }
    } catch (e) {
      console.log(`Error parsing login response: ${e}`);
    }
  }
  console.log(`❌ Login fallido con status: ${response.status}`);
  errorRate.add(1);
  return null;
}

// Obtener contratos del cliente
function getContratosCliente(token) {
  const startTime = new Date();
  
  const response = http.get(`${API_URL}${CONTRATOS_ENDPOINT}`, {
    headers: { 'Authorization': `Bearer ${token}` },
  });
  
  const endTime = new Date();
  getContratosDuration.add(endTime - startTime);
  
  if (response.status === 200) {
    try {
      const body = response.json();
      console.log(`Respuesta contratos:`, JSON.stringify(body, null, 2));
      
      // Manejar diferentes estructuras de respuesta
      let contratos = [];
      if (body.ok && body.data && Array.isArray(body.data)) {
        contratos = body.data;
      } else if (Array.isArray(body)) {
        contratos = body;
      } else if (body.data && Array.isArray(body.data)) {
        contratos = body.data;
      } else if (body.contratos && Array.isArray(body.contratos)) {
        contratos = body.contratos;
      }
      
      if (contratos.length > 0) {
        console.log(` Contratos encontrados: ${contratos.length}`);
        return contratos;
      } else {
        console.log(` No se encontraron contratos en la respuesta`);
      }
    } catch (e) {
      console.log(`Error parsing contratos: ${e}`);
    }
  } else {
    console.log(`❌ Error obteniendo contratos: ${response.status}`);
    console.log(`Respuesta: ${response.body}`);
  }
  return [];
}

// Inicializar crédito
function inicializarCredito() {
  if (inicializado) {
    return true;
  }
  
  console.log('\n╔════════════════════════════════════════════════════════════╗');
  console.log('║         INICIALIZANDO CRÉDITO DEL CLIENTE                  ║');
  console.log('╚════════════════════════════════════════════════════════════╝');
  
  // 1. Login
  const token = login();
  if (!token) {
    console.log('❌ No se pudo obtener token');
    return false;
  }
  
  // 2. Obtener contratos del cliente
  const contratos = getContratosCliente(token);
  
  if (contratos.length > 0) {
    let limiteTotalTemp = 0;
    let saldoUsadoTemp = 0;
    
    contratos.forEach(contrato => {
      const estado = contrato.estado || contrato.status;
      if (estado === 'VIGENTE' || estado === 'ACTIVO' || estado === 'vigente' || estado === 'activo') {
        const limite = parseFloat(contrato.limite_credito || contrato.limite || 0);
        const saldo = parseFloat(contrato.saldo_usado || contrato.saldoUsado || contrato.usado || 0);
        limiteTotalTemp += limite;
        saldoUsadoTemp += saldo;
        console.log(`   Contrato: ${contrato.numero_contrato} | Límite: Q${limite} | Usado: Q${saldo}`);
      }
    });
    
    limiteTotal = limiteTotalTemp;
    saldoUsadoInicial = saldoUsadoTemp;
    creditoDisponible = limiteTotalTemp - saldoUsadoTemp;
    totalGastadoEnNuevasOrdenes = 0;
    
    console.log('\n┌────────────────────────────────────────────────────────┐');
    console.log('│           ESTADO INICIAL DEL CLIENTE                   │');
    console.log('├────────────────────────────────────────────────────────┤');
    console.log(`│   LÍMITE TOTAL:                    Q${limiteTotal.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})} │`);
    console.log(`│   SALDO USADO (anterior):          Q${saldoUsadoInicial.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})} │`);
    console.log(`│   CRÉDITO DISPONIBLE:              Q${creditoDisponible.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})} │`);
    console.log('└────────────────────────────────────────────────────────┘');
  } else {
    console.log('⚠️ No se encontraron contratos vigentes');
    console.log('   Usando valores por defecto para la prueba');
    limiteTotal = 150000;
    saldoUsadoInicial = 28695.27;
    creditoDisponible = 121304.73;
    totalGastadoEnNuevasOrdenes = 0;
  }
  
  inicializado = true;
  return true;
}

// Generar peso aleatorio entre 8 y 11 kg
function generarPesoEstimado() {
  const peso = 8 + (Math.random() * 3);
  return parseFloat(peso.toFixed(2));
}

// Calcular costo de una orden
function calcularCosto(ruta, pesoEstimado) {
  const costoBase = ruta.distancia_km * ruta.costo_por_km;
  const costoPorPeso = pesoEstimado * 10;
  return parseFloat((costoBase + costoPorPeso).toFixed(2));
}

// Generar número de orden
function generarNumeroOrden(index) {
  const ahora = new Date();
  const anio = ahora.getFullYear();
  const mes = String(ahora.getMonth() + 1).padStart(2, '0');
  const dia = String(ahora.getDate()).padStart(2, '0');
  const secuencia = String(index + 1).padStart(4, '0');
  return `ORD-${anio}${mes}${dia}-${secuencia}`;
}

// Escenario principal
export default function () {
  const iteration = __ITER;
  
  // Inicializar crédito en la primera iteración
  if (!inicializado) {
    inicializarCredito();
  }
  
  // Verificar crédito disponible
  if (creditoDisponible <= 0) {
    console.log(`\n❌ [ITER ${iteration}] CRÉDITO INSUFICIENTE - Disponible: Q${creditoDisponible.toFixed(2)}`);
    creditosInsuficientesCount++;
    creditosInsuficientesMetric.add(1);
    errorRate.add(1);
    return;
  }
  
  // Seleccionar ruta aleatoria
  const ruta = RUTAS[Math.floor(Math.random() * RUTAS.length)];
  const peso = generarPesoEstimado();
  const costo = calcularCosto(ruta, peso);
  
  // Verificar si alcanza el crédito
  if (costo > creditoDisponible) {
    console.log(`\n❌ [ITER ${iteration}] CRÉDITO INSUFICIENTE - Costo: Q${costo.toFixed(2)} | Disponible: Q${creditoDisponible.toFixed(2)}`);
    creditosInsuficientesCount++;
    creditosInsuficientesMetric.add(1);
    errorRate.add(1);
    return;
  }
  
  // Generar orden
  const ordenIndex = ordenesGeneradasList.length + 1;
  const numeroOrden = generarNumeroOrden(ordenIndex);
  const creditoAntes = creditoDisponible;
  creditoDisponible -= costo;
  totalGastadoEnNuevasOrdenes += costo;
  
  const nuevoSaldoUsado = saldoUsadoInicial + totalGastadoEnNuevasOrdenes;
  const porcentajeLimite = (nuevoSaldoUsado / limiteTotal) * 100;
  
  const orden = {
    numero: ordenIndex,
    numero_orden: numeroOrden,
    fecha: new Date().toISOString(),
    ruta: ruta.nombre,
    origen: ruta.origen,
    destino: ruta.destino,
    distancia_km: ruta.distancia_km,
    peso_estimado: peso,
    costo: costo,
    credito_antes: creditoAntes,
    credito_despues: creditoDisponible,
    gasto_acumulado_prueba: totalGastadoEnNuevasOrdenes,
    gasto_total_cliente: nuevoSaldoUsado,
    cliente_id: CLIENTE_ID,
    cliente_nombre: CLIENTE_NOMBRE,
    iteration: iteration
  };
  
  ordenesGeneradasList.push(orden);
  ordenesCreadas.add(1);
  
  // Actualizar métricas con el estado actual
  limiteTotalMetric.add(limiteTotal);
  saldoUsadoInicialMetric.add(saldoUsadoInicial);
  creditoDisponibleFinalMetric.add(creditoDisponible);
  ordenesGeneradasTotal.add(ordenesGeneradasList.length);
  creditosInsuficientesTotal.add(creditosInsuficientesCount);
  totalNuevasOrdenesGastado.add(totalGastadoEnNuevasOrdenes);
  
  // Mostrar orden generada de forma ordenada
  console.log(`\n [ITER ${iteration}] ORDEN #${ordenIndex}: ${numeroOrden}`);
  console.log(`    Ruta: ${ruta.nombre}`);
  console.log(`    Peso: ${peso}kg | Costo: Q${costo.toFixed(2)}`);
  console.log(`    Crédito restante: Q${creditoDisponible.toFixed(2)}`);
  console.log(`    Total gastado cliente: Q${nuevoSaldoUsado.toFixed(2)} (${porcentajeLimite.toFixed(1)}% del límite)`);
  
  sleep(0.2);
}

// Al finalizar - Guardar archivos JSON
export function handleSummary(data) {
  // Obtener los valores finales de las métricas
  const limiteTotalFinal = data.metrics.limite_total?.values?.value || limiteTotal;
  const saldoUsadoInicialFinal = data.metrics.saldo_usado_inicial?.values?.value || saldoUsadoInicial;
  const creditoDisponibleFinal = data.metrics.credito_disponible_final?.values?.value || creditoDisponible;
  const ordenesGeneradasFinal = data.metrics.ordenes_generadas_total?.values?.value || ordenesGeneradasList.length;
  const creditosInsuficientesFinal = data.metrics.creditos_insuficientes_total?.values?.value || creditosInsuficientesCount;
  const totalNuevasOrdenesGastadoFinal = data.metrics.total_nuevas_ordenes_gastado?.values?.value || totalGastadoEnNuevasOrdenes;
  
  // Cálculos correctos
  const totalGastadoCliente = saldoUsadoInicialFinal + totalNuevasOrdenesGastadoFinal;
  const porcentajeUsado = limiteTotalFinal > 0 ? (totalGastadoCliente / limiteTotalFinal) * 100 : 0;
  const totalIntentos = ordenesGeneradasFinal + creditosInsuficientesFinal;
  const tasaExito = ordenesGeneradasFinal > 0 ? (ordenesGeneradasFinal / totalIntentos) * 100 : 0;
  
  // Resumen en consola ordenado
  console.log('\n');
  console.log('╔════════════════════════════════════════════════════════════════════╗');
  console.log('║                    RESUMEN FINAL DE LA PRUEBA                      ║');
  console.log('╚════════════════════════════════════════════════════════════════════╝');
  
  console.log('\n┌─────────────── DATOS DEL CLIENTE ───────────────┐');
  console.log(`│  Cliente: ${CLIENTE_NOMBRE.padEnd(35)}│`);
  console.log(`│  ID: ${CLIENTE_ID.toString().padEnd(42)}│`);
  console.log(`│  Email: ${CLIENTE_EMAIL.padEnd(35)}│`);
  console.log('└────────────────────────────────────────────────┘');
  
  console.log('\n┌─────────────── ESTADO INICIAL ────────────────┐');
  console.log(`│   Límite total:                 Q${limiteTotalFinal.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2}).padStart(12)} │`);
  console.log(`│   Saldo usado (anterior):       Q${saldoUsadoInicialFinal.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2}).padStart(12)} │`);
  console.log(`│   Crédito disponible:            Q${(limiteTotalFinal - saldoUsadoInicialFinal).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2}).padStart(12)} │`);
  console.log('└────────────────────────────────────────────────┘');
  
  console.log('\n┌─────────────── RESULTADOS DE LA PRUEBA ────────────────┐');
  console.log(`│  Órdenes generadas:                 ${ordenesGeneradasFinal.toString().padStart(8)} │`);
  console.log(`│  Total gastado en nuevas órdenes:   Q${totalNuevasOrdenesGastadoFinal.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2}).padStart(12)} │`);
  console.log(`│  Créditos insuficientes:            ${creditosInsuficientesFinal.toString().padStart(8)} │`);
  console.log(`│  Total intentos:                    ${totalIntentos.toString().padStart(8)} │`);
  console.log(`│  Tasa de éxito:                     ${tasaExito.toFixed(2)}%`.padStart(31) + ' │');
  console.log('└────────────────────────────────────────────────────────┘');
  
  console.log('\n┌─────────────── ESTADO FINAL ──────────────────┐');
  console.log(`│   Saldo usado TOTAL:               Q${totalGastadoCliente.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2}).padStart(12)} │`);
  console.log(`│   Crédito disponible restante:      Q${creditoDisponibleFinal.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2}).padStart(12)} │`);
  console.log(`│   Porcentaje del límite utilizado:  ${porcentajeUsado.toFixed(2)}%`.padStart(30) + ' │');
  console.log('└────────────────────────────────────────────────┘');
  
  console.log('\n Archivo generado: ordenes-resultado.json');
  console.log('════════════════════════════════════════════════════════════════════\n');
  
  // Preparar JSON ordenado
  const resultadoJson = {
    metadata: {
      fecha_prueba: new Date().toISOString(),
      tipo_prueba: "Prueba de carga - Control de crédito",
      cliente: {
        id: CLIENTE_ID,
        nombre: CLIENTE_NOMBRE,
        email: CLIENTE_EMAIL
      },
      configuracion: {
        vu: 1,
        iteraciones: 30,
        rutas_disponibles: RUTAS.length,
        max_duration: "2m"
      }
    },
    
    estado_inicial: {
      limite_total_credito: limiteTotalFinal,
      saldo_usado_anterior: saldoUsadoInicialFinal,
      credito_disponible_inicial: limiteTotalFinal - saldoUsadoInicialFinal,
      moneda: "GTQ"
    },
    
    resultados_prueba: {
      metricas_generales: {
        ordenes_generadas: ordenesGeneradasFinal,
        creditos_insuficientes: creditosInsuficientesFinal,
        total_intentos: totalIntentos,
        tasa_exito_porcentaje: parseFloat(tasaExito.toFixed(2))
      },
      gastos: {
        total_gastado_nuevas_ordenes: totalNuevasOrdenesGastadoFinal,
        total_gastado_acumulado_cliente: totalGastadoCliente,
        incremento_porcentual: saldoUsadoInicialFinal > 0 ? parseFloat(((totalNuevasOrdenesGastadoFinal / saldoUsadoInicialFinal) * 100).toFixed(2)) : 0
      }
    },
    
    estado_final: {
      saldo_usado_total: totalGastadoCliente,
      credito_disponible_final: creditoDisponibleFinal,
      porcentaje_limite_utilizado: parseFloat(porcentajeUsado.toFixed(2)),
      moneda: "GTQ"
    },
    
    rutas_disponibles: RUTAS,
    
    metricas_rendimiento: {
      tiempos_respuesta: {
        login_promedio_ms: data.metrics.login_duration?.values?.avg || 0,
        contratos_promedio_ms: data.metrics.get_contratos_duration?.values?.avg || 0
      },
      total_peticiones_http: data.metrics.http_reqs?.values?.count || 0,
      tasa_error: data.metrics.error_rate?.values?.rate || 0
    }
  };
  
  return {
    'ordenes-resultado.json': JSON.stringify(resultadoJson, null, 2),
  };
}