describe('Me page', () => {
  it('shows user information and can delete a non-admin account', () => {
    // stub login response to create a session in the app
    cy.intercept('POST', '/api/auth/login', {
      body: {
        token: 'token123',
        type: 'Bearer',
        id: 123,
        username: 'aliceSmith',
        firstName: 'Alice',
        lastName: 'Smith',
        admin: true
      },
    }).as('login')

    // stub user fetch used by the LoginComponent to fetch sessions after login
    cy.intercept('GET','/api/session', {}).as('session')

    // stub user fetch used by the MeComponent
    cy.intercept('GET', '/api/user/123', {
      body: {
        id: 123,
        email: 'yoga@studio.com',
        lastName: 'Smith',
        firstName: 'Alice',
        password: 'test!1234',
        admin: false,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-02-01T00:00:00Z'
      },
    }).as('getUser')

    // stub delete request for the delete flow
    cy.intercept('DELETE', '/api/user/123', {
      statusCode: 200,
      body: {}
    }).as('deleteUser')

    // visit login and perform login to set the in-memory session
    cy.visit('/login')
    cy.get('input[formControlName=email]').type("yoga@studio.com")
    cy.get('input[formControlName=password]').type("test!1234")
    cy.get('button[type=submit]').click()
    cy.wait('@login')

    // navigate to /me
    cy.contains('span.link', 'Account').click()
    cy.url().should('include', '/me')
    cy.wait('@getUser')

    cy.contains('Name: Alice SMITH')
    cy.contains('Email: yoga@studio.com')

    // for non-admin users the template shows a delete section with a button labelled "Detail"
    cy.get('button').contains('Detail').should('exist')

    // Click delete and assert the DELETE request was sent
    cy.get('button').contains('Detail').click()
    cy.wait('@deleteUser')
  })
})
