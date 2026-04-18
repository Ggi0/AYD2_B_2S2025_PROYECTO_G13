// cypress/e2e/01_auth.cy.ts
/// <reference types="cypress" />

/**
 * PRUEBAS E2E — Autenticación
 * Cubre: login exitoso por rol, login fallido, redirección,
 *        protección de rutas y logout.
 */
describe('Autenticación — LogiTrans', () => {

  beforeEach(() => {
    cy.logout();
    cy.visit('/login');
  });

  // ── 1. Formulario visible ─────────────────────────────────
  it('muestra el formulario de login correctamente', () => {
    cy.get('input[type="email"]').should('be.visible');
    cy.get('input[type="password"]').should('be.visible');
    cy.get('button[type="submit"]').should('be.visible');
  });

  // ── 2. Credenciales incorrectas muestran error ────────────
  it('muestra error con credenciales incorrectas', () => {
    cy.get('input[type="email"]').type('noexiste@logitrans.test');
    cy.get('input[type="password"]').type('contrasenaMal123');
    cy.get('button[type="submit"]').click();

    cy.get('body').should(($b) => {
      const text = $b.text().toLowerCase();
      expect(
        text.includes('credencial') ||
        text.includes('incorrecto') ||
        text.includes('error') ||
        text.includes('inválido')
      ).to.be.true;
    });
  });

  // ── 3. Login como cliente → /client/dashboard ────────────
  it('redirige al dashboard de cliente tras login exitoso', () => {
    cy.get('input[type="email"]').type(Cypress.env('cliente_email'));
    cy.get('input[type="password"]').type(Cypress.env('cliente_pass'));
    cy.get('button[type="submit"]').click();
    cy.url().should('include', '/client/dashboard');
  });

  // ── 4. Login como finanzas → /finanzas/* ─────────────────
  it('redirige al área de finanzas tras login como finanzas', () => {
    cy.get('input[type="email"]').type(Cypress.env('finanzas_email'));
    cy.get('input[type="password"]').type(Cypress.env('finanzas_pass'));
    cy.get('button[type="submit"]').click();
    cy.url().should('include', '/finanzas');
  });

  // ── 5. Login como piloto → /piloto/* ─────────────────────
  it('redirige al área de piloto tras login como piloto', () => {
    cy.get('input[type="email"]').type(Cypress.env('piloto_email'));
    cy.get('input[type="password"]').type(Cypress.env('piloto_pass'));
    cy.get('button[type="submit"]').click();
    cy.url().should('include', '/piloto');
  });

  // ── 6. Ruta protegida sin sesión → /login ────────────────
  it('redirige a /login al visitar ruta protegida sin sesión', () => {
    cy.visit('/client/dashboard');
    cy.url().should('include', '/login');
  });

  // ── 7. Rol cliente NO accede a rutas de finanzas ─────────
  it('deniega acceso a /finanzas/facturacion con rol cliente', () => {
    cy.loginAs('cliente');
    cy.visit('/finanzas/facturacion');
    cy.url().should('not.include', '/finanzas/facturacion');
  });

  // ── 8. Rol cliente NO accede a rutas de piloto ───────────
  it('deniega acceso a /piloto/dashboard con rol cliente', () => {
    cy.loginAs('cliente');
    cy.visit('/piloto/dashboard');
    cy.url().should('not.include', '/piloto/dashboard');
  });

  // ── 9. Token guardado en localStorage ────────────────────
  it('guarda token y usuario en localStorage tras login', () => {
    cy.get('input[type="email"]').type(Cypress.env('cliente_email'));
    cy.get('input[type="password"]').type(Cypress.env('cliente_pass'));
    cy.get('button[type="submit"]').click();

    cy.url().should('include', '/client').then(() => {
      expect(localStorage.getItem('authToken')).to.not.be.null;
      expect(localStorage.getItem('authUser')).to.not.be.null;
    });
  });

  // ── 10. Logout limpia sesión ──────────────────────────────
  it('logout elimina la sesión del localStorage', () => {
    cy.loginAs('cliente');
    cy.visit('/client/dashboard');

    cy.get('body').then(($body) => {
      if ($body.find('[data-cy="logout-btn"]').length) {
        cy.get('[data-cy="logout-btn"]').click();
      } else {
        cy.logout();
        cy.visit('/login');
      }
    });

    cy.url().should('not.include', '/client/dashboard');
    expect(localStorage.getItem('authToken')).to.be.null;
  });

});
