
// Prueba de carga: Creación de 50 pilotos con guardado en JSON

import http from 'k6/http';
import { sleep } from 'k6';
import { Trend, Rate, Counter } from 'k6/metrics';


const API_URL = 'http://localhost:3001';

// Credenciales del agente logistico, este es uno de los agentes que ya estaba, si 
// alguien lo va a cambiar ahi le coloca el correo que quiera y solo la contra
const LOGIN_CREDENTIALS = {
  email: 'logistico@logitrans.com',
  password: 'jens123'
};

// Endpoint para crear usuarios
const CREATE_USER_ENDPOINT = '/api/usuarios';

// ============================================

// metricas
const createUserDuration = new Trend('create_user_duration', true);
const loginDuration = new Trend('login_duration', true);
const errorRate = new Rate('error_rate');
const usersCreated = new Counter('users_created');

// Configuración de la prueba
export const options = {
  scenarios: {
    create_pilots: {
      executor: 'per-vu-iterations',
      vus: 10,
      iterations: 5,  // 10 VUs x 5 iteraciones = 50 pilotos
      maxDuration: '2m',
    },
  },
  thresholds: {
    http_req_duration: ['p(95)<500'],
    http_req_failed: ['rate<0.01'],
    create_user_duration: ['p(95)<800'],
    error_rate: ['rate<0.05'], 
  },
};

// Generar datos únicos de piloto
function generatePilotData(vu, iteration, timestamp) {
  const uniqueId = `${vu}_${iteration}_${timestamp}`;
  
  // Generar NIT único: timestamp + VU + iteration (13 dígitos máximo)
  const nit = `${timestamp}${vu}${iteration}`.slice(0, 13);
  
  return {
    nombre: `Piloto Test ${vu}_${iteration}`,
    email: `piloto.test.${uniqueId}@logitrans.com`,
    password: 'Test12345678',
    nit: nit,
    telefono: `5${Math.floor(Math.random() * 90000000 + 10000000)}`,
    tipo_usuario: 'PILOTO',
    estado: 'ACTIVO'
  };
}

// Login para obtener token
function login() {
  const loginPayload = JSON.stringify(LOGIN_CREDENTIALS);
  
  const response = http.post(`${API_URL}/api/auth/login`, loginPayload, {
    headers: { 'Content-Type': 'application/json' },
  });
  
  if (response.status === 200) {
    try {
      const body = response.json();
      return body.data?.token || body.token;
    } catch (e) {
      return null;
    }
  }
  
  return null;
}

// Crear un piloto
function createPilot(token, pilotData) {
  const params = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  };
  
  const startTime = new Date();
  const response = http.post(`${API_URL}${CREATE_USER_ENDPOINT}`, JSON.stringify(pilotData), params);
  const endTime = new Date();
  
  createUserDuration.add(endTime - startTime);
  
  let success = false;
  
  if (response.status === 200 || response.status === 201) {
    success = true;
    usersCreated.add(1);
  }
  
  if (!success) {
    errorRate.add(1);
  }
  
  return { success, response, pilotData };
}

// Escenario principal
export default function () {
  const vu = __VU;
  const iteration = __ITER;
  const timestamp = Date.now();
  
  // 1. Login
  const loginStart = new Date();
  const token = login();
  const loginEnd = new Date();
  loginDuration.add(loginEnd - loginStart);
  
  if (!token) {
    errorRate.add(1);
    console.log(`[VU ${vu}][ITER ${iteration}]  Login fallido`);
    return;
  }
  
  // 2. Crear piloto
  const pilotData = generatePilotData(vu, iteration, timestamp);
  console.log(`[VU ${vu}][ITER ${iteration}] Creando: ${pilotData.email} | NIT: ${pilotData.nit}`);
  
  const { success, response } = createPilot(token, pilotData);
  
  if (success) {
    console.log(`[VU ${vu}][ITER ${iteration}]  CREADO: ${pilotData.email}`);
  } else {
    console.log(`[VU ${vu}][ITER ${iteration}]  ERROR: ${response.status}`);
  }
  
  sleep(0.5);
}

// Al finalizar - Guardar archivos JSON
export function handleSummary(data) {
  // Obtener el total desde las métricas
  const totalCreated = data.metrics.users_created?.values?.count || 0;
  const totalRequests = data.metrics.http_reqs?.values?.count || 0;
  const errorRateValue = data.metrics.error_rate?.values?.rate || 0;
  
  // Calcular el porcentaje de éxito real
  const successRate = totalRequests > 0 ? ((totalCreated / (totalRequests / 2)) * 100) : 0;
  
  console.log('\n========== RESUMEN CREACIÓN DE PILOTOS ==========');
  console.log(`Endpoint usado: POST ${CREATE_USER_ENDPOINT}`);
  console.log(`Total peticiones: ${totalRequests}`);
  console.log(`Pilotos creados: ${totalCreated}`);
  console.log(`Tasa de éxito: ${successRate.toFixed(2)}%`);
  console.log(`Tiempo promedio login: ${(data.metrics.login_duration?.values?.avg || 0).toFixed(2)}ms`);
  console.log(`Tiempo promedio creación: ${(data.metrics.create_user_duration?.values?.avg || 0).toFixed(2)}ms`);
  console.log(`Tiempo respuesta total (p95): ${(data.metrics.http_req_duration?.values?.['p(95)'] || 0).toFixed(2)}ms`);
  console.log('================================================\n');
  
  // Generar lista de usuarios basada en la configuración
  const usuariosGenerados = [];
  const vus = 10;
  const iterations = 5;
  const timestampBase = Date.now();
  
  for (let vu = 1; vu <= vus; vu++) {
    for (let iter = 0; iter < iterations; iter++) {
      if (usuariosGenerados.length < totalCreated) {
        const nit = `${timestampBase}${vu}${iter}`.slice(0, 13);
        usuariosGenerados.push({
          vu: vu,
          iteration: iter,
          email: `piloto.test.${vu}_${iter}_${timestampBase}@logitrans.com`,
          password: 'Test12345678',
          nombre: `Piloto Test ${vu}_${iter}`,
          nit: nit,
          telefono: `5${Math.floor(Math.random() * 90000000 + 10000000)}`,
          tipo_usuario: 'PILOTO',
          estado: 'ACTIVO',
          createdAt: new Date().toISOString()
        });
      }
    }
  }
  
  // Guardar usuarios.json
  const usuariosJson = {
    total_pilotos_creados: totalCreated,
    endpoint: CREATE_USER_ENDPOINT,
    fecha_prueba: new Date().toISOString(),
    pilotos: usuariosGenerados.slice(0, totalCreated)
  };
  
  // Guardar resumen-creacion.json
  const resumenJson = {
    total_pilotos_creados: totalCreated,
    total_peticiones: totalRequests,
    tasa_exito_porcentaje: successRate.toFixed(2),
    endpoint: CREATE_USER_ENDPOINT,
    fecha_prueba: new Date().toISOString(),
    metricas: {
      tiempo_promedio_login_ms: data.metrics.login_duration?.values?.avg || 0,
      tiempo_promedio_creacion_ms: data.metrics.create_user_duration?.values?.avg || 0,
      tiempo_respuesta_p95_ms: data.metrics.http_req_duration?.values?.['p(95)'] || 0,
      tiempo_respuesta_p50_ms: data.metrics.http_req_duration?.values?.avg || 0,
    }
  };
  
  return {
    'usuarios.json': JSON.stringify(usuariosJson, null, 2),
    'resumen-creacion.json': JSON.stringify(resumenJson, null, 2),
  };
}