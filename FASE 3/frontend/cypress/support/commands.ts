// cypress/support/commands.ts
/// <reference types="cypress" />

/**
 * loginAs: login programático directo al API.
 * Evita repetir el flujo de UI en cada test.
 */
Cypress.Commands.add(
  'loginAs',
  (role: 'cliente' | 'finanzas' | 'gerencia' | 'logistico' | 'piloto' | 'patio' | 'operativo') => {
    const email    = Cypress.env(`${role}_email`);
    const password = Cypress.env(`${role}_pass`);

    cy.request({
      method: 'POST',
      url: `${Cypress.env('api_url')}/auth/login`,
      body: { email, password },
      failOnStatusCode: true,
    }).then((res) => {
      const { token, user } = res.body.data;
      localStorage.setItem('authToken', token);
      localStorage.setItem('authUser', JSON.stringify(user));
    });
  }
);

/** logout: limpia localStorage */
Cypress.Commands.add('logout', () => {
  localStorage.removeItem('authToken');
  localStorage.removeItem('authUser');
});

declare global {
  namespace Cypress {
    interface Chainable {
      loginAs(role: 'cliente' | 'finanzas' | 'gerencia' | 'logistico' | 'piloto' | 'patio' | 'operativo'): Chainable<void>;
      logout(): Chainable<void>;
    }
  }
}

export {};
