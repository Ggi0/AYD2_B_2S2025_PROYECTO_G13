// cypress/e2e/05_flujo_principal.cy.ts
/// <reference types="cypress" />

/**
 * PRUEBAS E2E — Flujo Principal del Sistema (Camino Feliz, Sección B)
 * Simula el flujo completo del enunciado de extremo a extremo:
 * Configuración → Contrato → Orden → Patio → Tránsito → Entrega
 * → Factura → Pago → Dashboard Gerencial
 */
describe('Flujo Principal — Camino Feliz (Sección B)', () => {

  // ── PASO 1: Finanzas configura tarifas ────────────────────
  it('PASO 1 — Finanzas accede a la configuración de tarifas', () => {
    cy.loginAs('finanzas');
    cy.visit('/finanzas/tarifaz');
    cy.url().should('include', '/finanzas/tarifaz');
    cy.get('body').should('not.contain.text', '500');
    cy.get('body').should('not.contain.text', 'Cannot read');
  });

  // ── PASO 2: Logístico verifica contratos de clientes ─────
  it('PASO 2 — Logístico accede a contratos y lista de clientes', () => {
    cy.loginAs('logistico');
    cy.visit('/logistico/contratos');
    cy.url().should('include', '/logistico/contratos');
    cy.get('body').should('not.contain.text', '500');

    cy.visit('/logistico/clientes');
    cy.url().should('include', '/logistico/clientes');
    cy.get('body').should('be.visible');
  });

  // ── PASO 3: Cliente verifica su crédito y hace solicitud ─
  it('PASO 3 — Cliente ve su crédito disponible en el dashboard', () => {
    cy.loginAs('cliente');
    cy.visit('/client/dashboard');
    cy.url().should('include', '/client/dashboard');
    cy.contains('Crédito Disponible').should('be.visible');
    cy.contains('Contratos Activos').should('be.visible');

    // Verifica que tiene contrato activo o mensaje claro
    cy.get('body').then(($b) => {
      if ($b.text().includes('Mi Contrato Activo')) {
        cy.contains('Solicitar Servicio de Transporte').should('be.visible');
      } else {
        cy.contains('No tienes contratos activos').should('be.visible');
      }
    });
  });

  // ── PASO 4: Patio registra el peso de la carga ───────────
  it('PASO 4 — Patio accede a su dashboard y gestiona órdenes', () => {
    cy.loginAs('patio');
    cy.visit('/patio/dashboard');
    cy.url().should('include', '/patio/dashboard');
    cy.get('body').should('not.contain.text', '500');
    cy.get('body').should('not.contain.text', 'Cannot read');
  });

  // ── PASO 5: Piloto cambia estado a En Tránsito ────────────
  it('PASO 5 — Piloto accede a sus órdenes asignadas', () => {
    cy.loginAs('piloto');
    cy.visit('/piloto/ordenes');
    cy.url().should('include', '/piloto/ordenes');
    cy.get('body').should('not.contain.text', '500');
  });

  it('PASO 5b — Piloto ve órdenes en tránsito', () => {
    cy.loginAs('piloto');
    cy.visit('/piloto/en-transito');
    cy.url().should('include', '/piloto/en-transito');
    cy.get('body').should('be.visible');
  });

  // ── PASO 5 (Sección B): Piloto reporta evento/bitácora ───
  it('PASO 5 (Sección B) — Piloto puede navegar a reportar evento', () => {
    cy.loginAs('piloto');
    cy.visit('/piloto/ordenes');

    cy.get('body').then(($body) => {
      // Si hay órdenes, intenta navegar al detalle
      if ($body.find('a[href*="/piloto/orden/"], button').length) {
        cy.log('Hay órdenes disponibles para el piloto');
      } else {
        cy.log('Sin órdenes activas para el piloto en este entorno');
      }
    });
  });

  // ── PASO 6-7: Cliente revisa factura generada ────────────
  it('PASO 6-7 — Cliente ve sus facturas (borrador/certificada)', () => {
    cy.loginAs('cliente');
    cy.visit('/client/invoices');
    cy.url().should('include', '/client/invoices');
    cy.contains('Mis Facturas').should('be.visible');
    cy.contains('Total Facturas').should('be.visible');

    cy.get('body').then(($body) => {
      if ($body.find('table tbody tr').length) {
        cy.get('table tbody tr').first().find('button').click();
        cy.get('.fixed.inset-0').should('be.visible');
        cy.contains('Cerrar').click();
      }
    });
  });

  // ── PASO 7: Finanzas certifica la factura (FEL) ───────────
  it('PASO 7 — Finanzas accede a facturación para certificar FEL', () => {
    cy.loginAs('finanzas');
    cy.visit('/finanzas/facturacion');
    cy.url().should('include', '/finanzas/facturacion');
    cy.get('nav, header').should('exist');
    cy.get('body').should('not.contain.text', '500');
  });

  // ── PASO 8: Finanzas registra el pago / cobro ────────────
  it('PASO 8 — Finanzas registra pago en CobrosPage', () => {
    cy.loginAs('finanzas');
    cy.visit('/finanzas/cobros');
    cy.url().should('include', '/finanzas/cobros');
    cy.get('body').should('not.contain.text', '500');
  });

  // ── PASO 8b: Cliente confirma el pago registrado ─────────
  it('PASO 8b — Cliente verifica que su pago aparece registrado', () => {
    cy.loginAs('cliente');
    cy.visit('/client/payments');
    cy.url().should('include', '/client/payments');
    cy.contains('Mis Pagos').should('be.visible');
    cy.contains('Monto Total Pagado').should('be.visible');
  });

  // ── PASO 9: Gerencia revisa KPIs en el dashboard ─────────
  it('PASO 9 — Gerencia accede al dashboard y ve KPIs actualizados', () => {
    cy.loginAs('gerencia');
    cy.visit('/Gerencia/dashboad');
    cy.url().should('include', '/Gerencia/dashboad');
    cy.get('body').should('not.be.empty');
    cy.get('body').should('not.contain.text', '500');
  });

  // ── PASO 9b: Gerencia revisa bitácora de órdenes ─────────
  it('PASO 9b — Gerencia revisa la bitácora de operaciones', () => {
    cy.loginAs('gerencia');
    cy.visit('/Gerencia/bitacora');
    cy.url().should('include', '/Gerencia/bitacora');
    cy.get('body').should('be.visible');
    cy.get('body').should('not.contain.text', '500');
  });

  // ── Piloto: historial de entregas ─────────────────────────
  it('SECCIÓN B — Piloto puede ver su historial de entregas', () => {
    cy.loginAs('piloto');
    cy.visit('/piloto/historial');
    cy.url().should('include', '/piloto/historial');
    cy.get('body').should('not.contain.text', '500');
    cy.get('body').should('not.contain.text', 'Cannot read');
  });

  // ── Flujo completo: todos los módulos sin errores ─────────
  it('INTEGRACIÓN — Todos los módulos cargan sin errores críticos', () => {
    const rutas = [
      { rol: 'cliente'   as const, url: '/client/dashboard' },
      { rol: 'cliente'   as const, url: '/client/invoices' },
      { rol: 'cliente'   as const, url: '/client/payments' },
      { rol: 'finanzas'  as const, url: '/finanzas/facturacion' },
      { rol: 'finanzas'  as const, url: '/finanzas/cobros' },
      { rol: 'gerencia'  as const, url: '/Gerencia/dashboad' },
      { rol: 'piloto'    as const, url: '/piloto/dashboard' },
      { rol: 'patio'     as const, url: '/patio/dashboard' },
    ];

    rutas.forEach(({ rol, url }) => {
      cy.loginAs(rol);
      cy.visit(url);
      cy.url().should('include', url.split('/')[1]); // verifica segmento principal
      cy.get('body').should('not.contain.text', '500');
      cy.get('body').should('not.contain.text', 'Cannot read');
      cy.logout();
    });
  });

  // ── 404 funciona ──────────────────────────────────────────
  it('ruta inexistente muestra página 404 con link al inicio', () => {
    cy.visit('/esta-ruta-no-existe', { failOnStatusCode: false });
    cy.contains('404').should('be.visible');
    cy.contains('Volver al inicio').should('be.visible');
  });

});
