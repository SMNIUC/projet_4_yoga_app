describe('Register spec', () => {
  beforeEach(() => {
    // make sure we always start from a clean state
    cy.visit('/register');
  });

  it('registers successfully and navigates to login', () => {
    // stub server response for a successful registration
    cy.intercept('POST', '/api/auth/register', {
      statusCode: 200,
      body: {}
    }).as('register');

    // the button should be disabled while the form is invalid
    cy.get('button[type=submit]').should('be.disabled');

    // fill the form with valid values
    cy.get('input[formControlName=firstName]').type('Alice');
    cy.get('input[formControlName=lastName]').type('Smith');
    cy.get('input[formControlName=email]').type('yoga@studio.com');
    cy.get('input[formControlName=password]').type('test!1234');

    // once all controls are valid the submit button becomes enabled
    cy.get('button[type=submit]').should('not.be.disabled');

    cy.get('button[type=submit]').click();
    cy.wait('@register');

    // successful registration should redirect the user to the login page
    cy.url().should('include', '/login');
  });

  it('displays an error message when the API returns a failure', () => {
    cy.intercept('POST', '/api/auth/register', {
      statusCode: 400,
      body: {
        message: 'Email already in use'
      }
    }).as('registerFail');

    // fill with values (button enabling is not important here)
    cy.get('input[formControlName=firstName]').type('Bob');
    cy.get('input[formControlName=lastName]').type('Jones');
    cy.get('input[formControlName=email]').type('bob@example.com');
    cy.get('input[formControlName=password]').type('password456');
    cy.get('button[type=submit]').click();

    cy.wait('@registerFail');

    // error banner should appear with the message from the response
    cy.contains('An error occurred : Email already in use').should('be.visible');

    // stay on register route
    cy.url().should('include', '/register');
  });
});
