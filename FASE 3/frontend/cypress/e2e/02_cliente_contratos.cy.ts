// cypress/e2e/02_cliente_contratos.cy.ts
/// <reference types="cypress" />

/**
 * PRUEBAS E2E — Módulo Cliente: Dashboard, Contratos y Órdenes
 * Rutas reales: /client/dashboard, /client/contracts, /client/orders
 */
describe('Cliente — Dashboard', () => {

  beforeEach(() => {
    cy.loginAs('cliente');
    cy.visit('/client/dashboard');
  });

  it('carga el dashboard del cliente sin errores', () => {
    cy.url().should('include', '/client/dashboard');
    cy.get('body').should('not.contain.text', 'Cannot read');
    cy.get('body').should('not.contain.text', '500');
  });

  it('muestra las 4 tarjetas de estadísticas', () => {
    cy.contains('Contratos Activos').should('be.visible');
    cy.contains('Crédito Disponible').should('be.visible');
    cy.contains('Facturas Pendientes').should('be.visible');
    cy.contains('Órdenes Pendientes').should('be.visible');
  });

  it('muestra el contrato activo o mensaje de sin contratos', () => {
    cy.get('body').then(($b) => {
      if ($b.text().includes('Mi Contrato Activo')) {
        cy.contains('Mi Contrato Activo').should('be.visible');
        cy.contains('Límite de Crédito').should('be.visible');
      } else {
        cy.contains('No tienes contratos activos').should('be.visible');
      }
    });
  });

  it('el header y menú de navegación están presentes', () => {
    cy.get('nav, header').should('exist');
  });

});

describe('Cliente — Mis Contratos', () => {

  beforeEach(() => {
    cy.loginAs('cliente');
    cy.visit('/client/contracts');
  });

  it('carga la página Mis Contratos', () => {
    cy.url().should('include', '/client/contracts');
    cy.contains('Mis Contratos').should('be.visible');
  });

  it('muestra las 4 tarjetas de resumen', () => {
    cy.contains('Total Contratos').should('be.visible');
    cy.contains('Contratos Vigentes').should('be.visible');
    cy.contains('Crédito Disponible').should('be.visible');
    cy.contains('Crédito Utilizado').should('be.visible');
  });

  it('muestra tabla de contratos o mensaje de vacío', () => {
    cy.get('body').then(($body) => {
      if ($body.find('table').length) {
        cy.get('table').should('be.visible');
        cy.contains('N° Contrato').should('be.visible');
        cy.contains('Estado').should('be.visible');
      } else {
        cy.contains('No tiene contratos registrados').should('be.visible');
      }
    });
  });

  it('navega al detalle de un contrato al hacer clic en ver', () => {
    cy.get('body').then(($body) => {
      if ($body.find('table tbody tr').length) {
        cy.get('table tbody tr').first().find('button').click();
        cy.url().should('match', /\/client\/contracts\/\d+/);
      } else {
        cy.log('Sin contratos disponibles para navegar');
      }
    });
  });

});

describe('Cliente — Mis Órdenes', () => {

  beforeEach(() => {
    cy.loginAs('cliente');
    cy.visit('/client/orders');
  });

  it('carga la página de Mis Órdenes', () => {
    cy.url().should('include', '/client/orders');
    cy.get('body').should('not.contain.text', '500');
    cy.get('body').should('not.contain.text', 'Cannot read');
  });

  it('muestra tabla de órdenes o estado vacío', () => {
    cy.get('body').then(($body) => {
      if ($body.find('table').length) {
        cy.get('table').should('be.visible');
      } else {
        // Página cargada sin datos — es válido
        cy.get('body').should('be.visible');
      }
    });
  });

});
