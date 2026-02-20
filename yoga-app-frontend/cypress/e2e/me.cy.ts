describe('Me page', () => {
  it('shows user information and can delete a non-admin account', () => {
    // stub login response to create a session in the app
    cy.intercept('POST', '/api/auth/login', {
      body: {
        id: 123,
        username: 'alice',
        firstName: 'Alice',
        lastName: 'Smith',
        email: 'alice@example.com',
        admin: false
      },
    }).as('login')

    // stub user fetch used by the MeComponent
    cy.intercept('GET', '/api/users/123', {
      body: {
        id: 123,
        firstName: 'Alice',
        lastName: 'Smith',
        email: 'alice@example.com',
        admin: false,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-02-01T00:00:00Z'
      },
    }).as('getUser')

    // stub delete request for the delete flow
    cy.intercept('DELETE', '/api/users/123', {
      statusCode: 200,
      body: {}
    }).as('deleteUser')

    // visit login and perform login to set the in-memory session
    cy.visit('/login')
    cy.get('input[formControlName=email]').type('alice@example.com')
    cy.get('input[formControlName=password]').type('Password1!{enter}{enter}')
    cy.wait('@login')

    // navigate to /me and ensure the user info is displayed
    cy.visit('/me')
    cy.wait('@getUser')

    cy.contains('Name: Alice SMITH')
    cy.contains('Email: alice@example.com')

    // for non-admin users the template shows a delete section with a button labelled "Detail"
    cy.get('button').contains('Detail').should('exist')

    // Click delete and assert the DELETE request was sent
    cy.get('button').contains('Detail').click()
    cy.wait('@deleteUser')
  })
})
