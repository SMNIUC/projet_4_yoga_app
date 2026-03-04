describe('Session Form spec', () => {
  const teachersData = [
    {
      id: 1,
      lastName: 'Doe',
      firstName: 'Jane',
      createdAt: '2025-12-19T07:50:30.392Z',
      updatedAt: '2025-12-19T07:50:30.392Z'
    },
    {
      id: 2,
      lastName: 'Smith',
      firstName: 'John',
      createdAt: '2025-12-19T07:50:30.392Z',
      updatedAt: '2025-12-19T07:50:30.392Z'
    }
  ];

  const existingSession = {
      id: 42,
      name: 'Morning Flow',
      description: 'A gentle morning yoga session',
      date: '2025-02-20T08:00:00.000Z',
      teacher_id: 1,
      users: [],
      createdAt: '2025-12-19T07:50:30.392Z',
      updatedAt: '2025-12-19T07:50:30.392Z'
    };

  beforeEach(() => {
    // login as admin first
    cy.visit('/login');

    cy.intercept('POST', '/api/auth/login', {
      body: {
        token: 'token123',
        type: 'Bearer',
        id: 123,
        username: 'adminUser',
        firstName: 'Admin',
        lastName: 'User',
        admin: true
      },
    }).as('login');

    cy.intercept('GET', '/api/session', {
      body: [existingSession]
    }).as('sessionsList');

    cy.intercept('GET', '/api/teacher', {
      body: teachersData
    }).as('teachers');

    // perform login
    cy.get('input[formControlName=email]').type('yoga@studio.com');
    cy.get('input[formControlName=password]').type('test!1234');
    cy.get('button[type=submit]').click()
    cy.wait('@login');
    cy.wait('@sessionsList');
  });

  it('admin can create a new session', () => {
    cy.intercept('POST', '/api/session', {
      statusCode: 201,
      body: {
        id: 100,
        name: 'New Yoga Flow',
        description: 'A brand new yoga session',
        date: '2025-03-15T10:00:00.000Z',
        teacher_id: 1,
        users: [],
        createdAt: '2025-12-19T07:50:30.392Z',
        updatedAt: '2025-12-19T07:50:30.392Z'
      }
    }).as('createSession');

    // navigate to create form
    cy.contains('button', 'Create').click()
    cy.url().should('include', '/create')
    cy.wait('@teachers');

    // page shows Create session title
    cy.contains('h1', 'Create session').should('be.visible');

    // submit button should be disabled initially
    cy.get('button[type=submit]').should('be.disabled');

    // fill the form
    cy.get('input[formControlName=name]').type('New Yoga Flow');
    cy.get('input[formControlName=date]').type('2025-03-15');
    cy.get('mat-select[formControlName=teacher_id]').click();
    cy.get('mat-option').contains('Jane Doe').click();
    cy.get('textarea[formControlName=description]').type('A brand new yoga session');

    // submit button becomes enabled
    cy.get('button[type=submit]').should('not.be.disabled');

    // submit the form
    cy.get('button[type=submit]').click();
    cy.wait('@createSession');

    // should redirect to sessions list after success
    cy.url().should('include', '/sessions');
  });

  it('admin can update an existing session', () => {
    cy.intercept('GET', '/api/session/42', {
      body: existingSession
    }).as('getSession');

    cy.intercept('PUT', '/api/session/42', {
      statusCode: 200,
      body: {
        ...existingSession,
        name: 'Updated Morning Flow',
        description: 'An updated yoga session',
        teacher_id: 2
      }
    }).as('updateSession');

    // navigate to update form
    cy.contains('button', 'Edit').click()
    cy.url().should('include', '/update/42')
    cy.wait('@getSession');
    cy.wait('@teachers');

    // page shows Update session title
    cy.contains('h1', 'Update session').should('be.visible');

    // form should be pre-filled with existing data
    cy.get('input[formControlName=name]').should('have.value', existingSession.name);
    cy.get('input[formControlName=date]').should('have.value', '2025-02-20');
    cy.get('textarea[formControlName=description]').should('have.value', existingSession.description);

    // update the form fields
    cy.get('input[formControlName=name]').clear().type('Updated Morning Flow');
    cy.get('textarea[formControlName=description]').clear().type('An updated yoga session');
    cy.get('mat-select[formControlName=teacher_id]').click();
    cy.get('mat-option').contains('John Smith').click();

    // submit the form
    cy.get('button[type=submit]').click();
    cy.wait('@updateSession');

    // should redirect to sessions list after success
    cy.url().should('include', '/sessions');
  });

  it('form validation prevents submission with invalid data', () => {
    cy.contains('button', 'Create').click()
    cy.url().should('include', '/create')
    cy.wait('@teachers');

    // submit button should be disabled
    cy.get('button[type=submit]').should('be.disabled');

    // fill only name field
    cy.get('input[formControlName=name]').type('Incomplete Form');

    // submit button should still be disabled (missing required fields)
    cy.get('button[type=submit]').should('be.disabled');

    // fill all required fields
    cy.get('input[formControlName=date]').type('2025-03-20');
    cy.get('mat-select[formControlName=teacher_id]').click();
    cy.get('mat-option').first().click();
    cy.get('textarea[formControlName=description]').type('Complete description');

    // submit button should now be enabled
    cy.get('button[type=submit]').should('not.be.disabled');
  });
});
