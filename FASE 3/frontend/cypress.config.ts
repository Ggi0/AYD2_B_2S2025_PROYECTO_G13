// cypress.config.ts
import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:5173',
    viewportWidth: 1280,
    viewportHeight: 720,
    defaultCommandTimeout: 8000,
    requestTimeout: 10000,
    video: false,
    screenshotOnRunFailure: true,
    setupNodeEvents(on, config) {
      return config;
    },
  },
  env: {
    // ⚠️ Cambia estos valores por los usuarios reales de tu DB de desarrollo
    cliente_email:   'cliente@logitrans.test',
    cliente_pass:    'Test1234!',
    finanzas_email:  'finanzas@logitrans.test',
    finanzas_pass:   'Test1234!',
    gerencia_email:  'gerencia@logitrans.test',
    gerencia_pass:   'Test1234!',
    logistico_email: 'logistico@logitrans.test',
    logistico_pass:  'Test1234!',
    piloto_email:    'piloto@logitrans.test',
    piloto_pass:     'Test1234!',
    patio_email:     'patio@logitrans.test',
    patio_pass:      'Test1234!',
    operativo_email: 'operativo@logitrans.test',
    operativo_pass:  'Test1234!',
    api_url:         'http://localhost:3001/api',
  },
});
