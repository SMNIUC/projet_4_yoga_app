describe('App spec', () => {
  const adminBody = {
    token: 'token123',
    type: 'Bearer',
    id: 123,
    username: 'adminUser',
    firstName: 'Admin',
    lastName: 'User',
    admin: true
  };

  beforeEach(() => {
    // stub any session-related fetches used by nav destinations
    cy.intercept('GET', '/api/session', { body: [] }).as('sessions');
    cy.intercept('GET', '/api/user/123', { body: { id: 123, email: 'a@b.com', firstName: 'A', lastName: 'B', admin: true } }).as('me');
  });

  it('shows login/register when not authenticated', () => {
    cy.visit('/');
    // guard will redirect to login
    cy.url().should('include', '/login');
    cy.get('span').contains('Sessions').should('not.exist');
    cy.get('a.link').contains('Login').should('be.visible');
    cy.get('a.link').contains('Register').should('be.visible');

    // navigation via links
    cy.get('a.link').contains('Register').click();
    cy.url().should('include', '/register');
  });

  it('updates toolbar after login and permits logout', () => {
    cy.intercept('POST', '/api/auth/login', { body: adminBody }).as('login');

    cy.visit('/login');
    cy.get('input[formControlName=email]').type('yoga@studio.com');
    cy.get('input[formControlName=password]').type('test!1234');
    cy.get('button[type=submit]').click();
    cy.wait('@login');

    // toolbar should now show session/account/logout
    cy.get('span.link').contains('Sessions').should('be.visible');
    cy.get('span.link').contains('Account').should('be.visible');
    cy.get('span.link').contains('Logout').should('be.visible');

    // clicks navigate appropriately
    cy.get('span.link').contains('Sessions').click();
    cy.wait('@sessions');
    cy.url().should('include', '/sessions');

    cy.get('span.link').contains('Account').click();
    cy.wait('@me');
    cy.url().should('include', '/me');

    // logout returns to login and toolbar resets
    cy.get('span.link').contains('Logout').click();
    cy.url().should('include', '/login');
    cy.get('a.link').contains('Login').should('be.visible');
    cy.get('a.link').contains('Register').should('be.visible');
  });
});
