describe('Login spec', () => {
  it('Login successfull', () => {
    cy.visit('/login')

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
    })

    cy.intercept('GET','/api/session', {
      body: [
        {
          id: '1',
          name: 'Morning Yoga',
          description: 'Start your day with a refreshing yoga session.',
          date: '2024-01-01T08:00:00Z',
          duration: 60,
          instructor: 'Alice Smith',
          participants: []
        },
        {
          id: '2',
          name: 'Evening Relaxation',
          description: 'Wind down with gentle stretches and breathing exercises.',
          date: '2024-01-01T18:00:00Z',
          duration: 45,
          instructor: 'Bob Johnson',
          participants: []
        }
      ],
    }).as('session')

    cy.get('input[formControlName=email]').type("yoga@studio.com")
    cy.get('input[formControlName=password]').type(`${"test!1234"}{enter}{enter}`)

    cy.url().should('include', '/sessions')
  })
});