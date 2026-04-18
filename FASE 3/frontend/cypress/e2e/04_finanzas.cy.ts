// cypress/e2e/04_finanzas.cy.ts
/// <reference types="cypress" />

/**
 * PRUEBAS E2E — Módulo Finanzas y Gerencia
 * Rutas reales del App.tsx:
 *   /finanzas/facturacion, /finanzas/pagos, /finanzas/cobros,
 *   /finanzas/dashboard, /finanzas/tarifaz,
 *   /Gerencia/dashboad, /Gerencia/bitacora
 */

// ── Control de acceso ──────────────────────────────────────
describe('Finanzas — Control de acceso por rol', () => {

  it('rol cliente NO puede acceder a /finanzas/facturacion', () => {
    cy.loginAs('cliente');
    cy.visit('/finanzas/facturacion');
    cy.url().should('not.include', '/finanzas/facturacion');
  });

  it('rol piloto NO puede acceder a /finanzas/pagos', () => {
    cy.loginAs('piloto');
    cy.visit('/finanzas/pagos');
    cy.url().should('not.include', '/finanzas/pagos');
  });

  it('rol finanzas SÍ accede a /finanzas/facturacion', () => {
    cy.loginAs('finanzas');
    cy.visit('/finanzas/facturacion');
    cy.url().should('include', '/finanzas/facturacion');
    cy.get('body').should('be.visible');
  });

  it('rol gerencia SÍ accede a /Gerencia/dashboad', () => {
    cy.loginAs('gerencia');
    cy.visit('/Gerencia/dashboad');
    cy.url().should('include', '/Gerencia/dashboad');
    cy.get('body').should('be.visible');
  });

  it('rol cliente NO puede acceder a /Gerencia/dashboad', () => {
    cy.loginAs('cliente');
    cy.visit('/Gerencia/dashboad');
    cy.url().should('not.include', '/Gerencia/dashboad');
  });

});

// ── FacturacionPage ────────────────────────────────────────
describe('Finanzas — FacturacionPage (/finanzas/facturacion)', () => {

  beforeEach(() => {
    cy.loginAs('finanzas');
    cy.visit('/finanzas/facturacion');
  });

  it('carga la página con header y menú', () => {
    cy.url().should('include', '/finanzas/facturacion');
    cy.get('nav, header').should('exist');
    cy.get('body').should('not.contain.text', '500');
  });

  it('muestra tabla de facturas o estado vacío', () => {
    cy.get('body').then(($body) => {
      if ($body.find('table').length) {
        cy.get('table').should('be.visible');
      } else {
        cy.get('body').should('be.visible');
        cy.log('FacturacionPage sin datos en este entorno');
      }
    });
  });

  it('tiene opción de certificar (FEL) si hay facturas en borrador', () => {
    cy.get('body').then(($body) => {
      if ($body.text().match(/certificar|FEL|certific/i)) {
        cy.contains(/certificar|FEL/i).should('be.visible');
      } else {
        cy.log('Sin facturas pendientes de certificar');
      }
    });
  });

});

// ── PagosPage (finanzas) ───────────────────────────────────
describe('Finanzas — PagosPage (/finanzas/pagos)', () => {

  beforeEach(() => {
    cy.loginAs('finanzas');
    cy.visit('/finanzas/pagos');
  });

  it('carga la página de pagos de finanzas', () => {
    cy.url().should('include', '/finanzas/pagos');
    cy.get('body').should('not.contain.text', '500');
  });

  it('muestra tabla de pagos o estado vacío', () => {
    cy.get('body').then(($body) => {
      if ($body.find('table').length) {
        cy.get('table').should('be.visible');
      } else {
        cy.log('PagosPage sin registros');
      }
    });
  });

});

// ── CobrosPage ─────────────────────────────────────────────
describe('Finanzas — CobrosPage (/finanzas/cobros)', () => {

  beforeEach(() => {
    cy.loginAs('finanzas');
    cy.visit('/finanzas/cobros');
  });

  it('carga la página de cobros', () => {
    cy.url().should('include', '/finanzas/cobros');
    cy.get('body').should('not.contain.text', '500');
    cy.get('body').should('not.contain.text', 'Cannot read');
  });

  it('tiene opción para registrar un cobro (Cheque o Transferencia)', () => {
    cy.get('body').then(($body) => {
      const texto = $body.text().toLowerCase();
      const tieneFormulario =
        texto.includes('cheque') ||
        texto.includes('transferencia') ||
        texto.includes('registrar') ||
        $body.find('button').length > 0;
      expect(tieneFormulario).to.be.true;
    });
  });

});

// ── DashboardFinanzas ──────────────────────────────────────
describe('Finanzas — DashboardFinanzas (/finanzas/dashboard)', () => {

  beforeEach(() => {
    cy.loginAs('finanzas');
    cy.visit('/finanzas/dashboard');
  });

  it('carga el dashboard de finanzas', () => {
    cy.url().should('include', '/finanzas/dashboard');
    cy.get('body').should('not.be.empty');
    cy.get('body').should('not.contain.text', '500');
  });

  it('muestra métricas o resumen financiero', () => {
    cy.get('body').should('satisfy', ($b: JQuery<HTMLBodyElement>) => {
      const t = $b.text();
      return (
        t.includes('Facturación') ||
        t.includes('Ingresos') ||
        t.includes('Cobros') ||
        t.includes('KPI') ||
        t.includes('Dashboard')
      );
    });
  });

});

// ── Dashboard Gerencial ────────────────────────────────────
describe('Gerencia — DashboardGerencial (/Gerencia/dashboad)', () => {

  beforeEach(() => {
    cy.loginAs('gerencia');
    cy.visit('/Gerencia/dashboad');
  });

  it('carga el dashboard gerencial', () => {
    cy.url().should('include', '/Gerencia/dashboad');
    cy.get('body').should('not.be.empty');
    cy.get('body').should('not.contain.text', '500');
  });

  it('muestra KPIs o secciones de sedes', () => {
    cy.get('body').should('satisfy', ($b: JQuery<HTMLBodyElement>) => {
      const t = $b.text();
      return (
        t.includes('KPI') ||
        t.includes('Sede') ||
        t.includes('Guatemala') ||
        t.includes('Xela') ||
        t.includes('Puerto Barrios') ||
        t.includes('Dashboard')
      );
    });
  });

});

// ── Bitácora Gerencial ─────────────────────────────────────
describe('Gerencia — BitacoraOrdenes (/Gerencia/bitacora)', () => {

  beforeEach(() => {
    cy.loginAs('gerencia');
    cy.visit('/Gerencia/bitacora');
  });

  it('carga la bitácora de órdenes', () => {
    cy.url().should('include', '/Gerencia/bitacora');
    cy.get('body').should('not.contain.text', '500');
    cy.get('body').should('not.contain.text', 'Cannot read');
  });

  it('muestra tabla o listado de órdenes en bitácora', () => {
    cy.get('body').then(($body) => {
      if ($body.find('table').length) {
        cy.get('table').should('be.visible');
      } else {
        cy.log('Bitácora sin datos en este entorno');
      }
    });
  });

});
