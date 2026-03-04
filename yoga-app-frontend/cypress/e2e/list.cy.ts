describe('Sessions List page', () => {
  const sessions = [
    {
      id: 1,
      name: 'Morning Yoga',
      description: 'Start your day right',
      date: '2025-01-01T08:00:00Z',
      teacher_id: 1,
      users: [],
      createdAt: '2024-12-01T00:00:00Z',
      updatedAt: '2024-12-02T00:00:00Z'
    },
    {
      id: 2,
      name: 'Evening Stretch',
      description: 'Wind down',
      date: '2025-01-01T18:00:00Z',
      teacher_id: 2,
      users: [],
      createdAt: '2024-12-03T00:00:00Z',
      updatedAt: '2024-12-04T00:00:00Z'
    }
  ];

  const loginAdmin = () => {
    cy.intercept('POST', '/api/auth/login', {
      body: {
        token: 'token123',
        type: 'Bearer',
        id: 123,
        username: 'adminUser',
        firstName: 'Admin',
        lastName: 'User',
        admin: true
      }
    }).as('login');
  };

  const loginRegular = () => {
    cy.intercept('POST', '/api/auth/login', {
      body: {
        token: 'token123',
        type: 'Bearer',
        id: 456,
        username: 'normalUser',
        firstName: 'Normal',
        lastName: 'User',
        admin: false
      }
    }).as('login');
  };

  beforeEach(() => {
    cy.intercept('GET', '/api/session', { body: sessions }).as('getSessions');
  });

  it('shows sessions and allows admin to navigate to create/update/detail', () => {
    loginAdmin();
    cy.visit('/login');
    cy.get('input[formControlName=email]').type('yoga@studio.com');
    cy.get('input[formControlName=password]').type('test!1234');
    cy.get('button[type=submit]').click()
    cy.wait('@login');
    cy.wait('@getSessions');

    // header create button visible
    cy.get('button').contains('Create').should('exist');

    // verify listed sessions
    cy.contains('Morning Yoga');
    cy.contains('Evening Stretch');

    // detail button on first card
    cy.get('button').contains('Detail').first().click();
    cy.url().should('include', '/sessions/detail/1');

    // go back to the list using browser history
    cy.go('back');

    // edit button present
    cy.get('button').contains('Edit').first().click();
    cy.url().should('include', '/sessions/update/1');

    // navigate back using browser history then click create
    cy.go('back');
    cy.get('button').contains('Create').click();
    cy.url().should('include', '/sessions/create');
  });

  it('non-admin sees only detail links', () => {
    loginRegular();
    cy.visit('/login');
    cy.get('input[formControlName=email]').type('yoga@studio.com');
    cy.get('input[formControlName=password]').type('test!1234');
    cy.get('button[type=submit]').click();
    cy.wait('@login');
    cy.wait('@getSessions');

    cy.get('button').contains('Create').should('not.exist');
    cy.get('button').contains('Edit').should('not.exist');
    cy.get('button').contains('Detail').should('have.length.at.least', 1);

    cy.get('button').contains('Detail').first().click();
    cy.url().should('include', '/sessions/detail/1');
  });
});
