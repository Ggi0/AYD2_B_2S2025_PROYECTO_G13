// cypress/e2e/03_cliente_facturas_pagos.cy.ts
/// <reference types="cypress" />

/**
 * PRUEBAS E2E — Módulo Cliente: Facturas y Pagos
 * Rutas reales: /client/invoices, /client/payments
 */
describe('Cliente — Mis Facturas (/client/invoices)', () => {

  beforeEach(() => {
    cy.loginAs('cliente');
    cy.visit('/client/invoices');
  });

  it('carga la página de Mis Facturas', () => {
    cy.url().should('include', '/client/invoices');
    cy.contains('Mis Facturas').should('be.visible');
    cy.contains('Historial de facturación').should('be.visible');
  });

  it('muestra las 4 tarjetas de resumen', () => {
    cy.contains('Total Facturas').should('be.visible');
    cy.contains('Por Pagar').should('be.visible');
    cy.contains('Pagadas').should('be.visible');
    cy.contains('Monto Pendiente').should('be.visible');
  });

  it('tiene selector de filtro por estado', () => {
    cy.get('select').should('exist').and('be.visible');
    cy.get('select').select('PAGADA');
    cy.get('select').should('have.value', 'PAGADA');
    cy.get('select').select('TODOS');
    cy.get('select').should('have.value', 'TODOS');
  });

  it('muestra tabla de facturas o mensaje de vacío', () => {
    cy.get('body').then(($body) => {
      if ($body.find('table').length) {
        cy.get('table').should('be.visible');
        cy.contains('N° Factura').should('be.visible');
        cy.contains('Estado').should('be.visible');
        cy.contains('Total').should('be.visible');
      } else {
        cy.contains('No hay facturas que mostrar').should('be.visible');
      }
    });
  });

  it('filtro CERTIFICADA muestra solo facturas certificadas', () => {
    cy.get('select').select('CERTIFICADA');
    cy.get('body').then(($body) => {
      if ($body.find('table tbody tr').length) {
        cy.get('table tbody tr').each(($row) => {
          cy.wrap($row).should('contain.text', 'Certificada');
        });
      } else {
        cy.contains('No hay facturas que mostrar').should('be.visible');
      }
    });
  });

  it('abre el modal de detalle y lo cierra correctamente', () => {
    cy.get('body').then(($body) => {
      if ($body.find('table tbody tr').length) {
        cy.get('table tbody tr').first().find('button').click();
        cy.get('.fixed.inset-0').should('be.visible');
        cy.contains('Fecha de emisión').should('be.visible');
        cy.contains('Cerrar').click();
        cy.get('.fixed.inset-0').should('not.exist');
      } else {
        cy.log('Sin facturas para probar el modal');
      }
    });
  });

  it('no muestra errores 500 ni pantalla en blanco', () => {
    cy.get('body').should('not.be.empty');
    cy.get('body').should('not.contain.text', '500');
    cy.get('body').should('not.contain.text', 'Cannot read');
  });

});

describe('Cliente — Mis Pagos (/client/payments)', () => {

  beforeEach(() => {
    cy.loginAs('cliente');
    cy.visit('/client/payments');
  });

  it('carga la página de Mis Pagos', () => {
    cy.url().should('include', '/client/payments');
    cy.contains('Mis Pagos').should('be.visible');
    cy.contains('Historial de pagos').should('be.visible');
  });

  it('muestra las 4 tarjetas de resumen de pagos', () => {
    cy.contains('Total Pagos').should('be.visible');
    cy.contains('Monto Total Pagado').should('be.visible');
    cy.contains('Transferencias').should('be.visible');
    cy.contains('Cheques').should('be.visible');
  });

  it('tiene selector de filtro por tipo de pago', () => {
    cy.get('select').should('exist');
    cy.get('select').select('TRANSFERENCIA');
    cy.get('select').should('have.value', 'TRANSFERENCIA');
    cy.get('select').select('CHEQUE');
    cy.get('select').should('have.value', 'CHEQUE');
    cy.get('select').select('TODOS');
  });

  it('filtra por TRANSFERENCIA y muestra solo ese tipo', () => {
    cy.get('select').select('TRANSFERENCIA');
    cy.get('body').then(($body) => {
      if ($body.find('table tbody tr').length) {
        cy.get('table tbody tr').each(($row) => {
          cy.wrap($row).should('contain.text', 'Transferencia');
        });
      } else {
        cy.contains('No hay pagos que mostrar').should('be.visible');
      }
    });
  });

  it('abre el modal de detalle de pago y lo cierra', () => {
    cy.get('body').then(($body) => {
      if ($body.find('table tbody tr').length) {
        cy.get('table tbody tr').first().find('button').click();
        cy.get('.fixed.inset-0').should('be.visible');
        cy.contains('Detalle de Pago').should('be.visible');
        cy.contains('Monto pagado').should('be.visible');
        cy.contains('N° Autorización').should('be.visible');
        cy.contains('Cerrar').click();
        cy.get('.fixed.inset-0').should('not.exist');
      } else {
        cy.log('Sin pagos para probar el modal');
      }
    });
  });

  it('muestra tabla de pagos o estado vacío', () => {
    cy.get('body').then(($body) => {
      if ($body.find('table').length) {
        cy.get('table').should('be.visible');
        cy.contains('Fecha').should('be.visible');
        cy.contains('Tipo').should('be.visible');
        cy.contains('Monto').should('be.visible');
      } else {
        cy.contains('No hay pagos que mostrar').should('be.visible');
      }
    });
  });

});
