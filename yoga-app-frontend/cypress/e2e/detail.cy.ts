describe('Session Detail page', () => {
	beforeEach(() => {
		// start from login to create an in-memory session as other specs do
		cy.visit('/login');
	});

	it('admin can delete a session and is redirected to sessions list', () => {
		// stub login as admin
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

        const initialSession = {
			id: 42,
				name: 'morning flow',
				description: 'A test session',
				date: '2025-12-19T07:50:30.392Z',
				teacher_id: 1,
				users: [],
				createdAt: '2025-12-19T07:50:30.392Z',
				updatedAt: '2025-12-19T07:50:30.392Z'
		};

		// stub sessions list
		cy.intercept('GET', '/api/session', {
			body: [initialSession]
		}).as('sessionsList');

		// stub detail and teacher responses
		cy.intercept('GET', '/api/session/42', {body: initialSession}).as('getSession');

		cy.intercept('GET', '/api/teacher/1', {
			body: {
				id: 1,
				lastName: 'Doe',
				firstName: 'Jane',
				createdAt: '2025-12-19T07:50:30.392Z',
				updatedAt: '2025-12-19T07:50:30.392Z'
			}
		}).as('getTeacher');

		cy.intercept('DELETE', '/api/session/42', {
			statusCode: 200,
			body: {}
		}).as('deleteSession');

		// perform login
		cy.get('input[formControlName=email]').type('yoga@studio.com');
		cy.get('input[formControlName=password]').type('test!1234');
        cy.get('button[type=submit]').click();
		cy.wait('@login');
		cy.wait('@sessionsList');

		// click Detail button to navigate to session detail
		cy.get('button').contains('Detail').first().click();
		cy.wait('@getSession');
		cy.wait('@getTeacher');

		// page shows session title
		cy.contains('h1', 'Morning Flow').should('be.visible');

		// admin should see Delete button
		cy.get('button').contains('Delete').should('exist').click();

		cy.wait('@deleteSession');

		// expect to be redirected to sessions list
		cy.url().should('include', '/sessions');
	});

	it('non-admin can participate and un-participate', () => {
		// stub login as non-admin
		cy.intercept('POST', '/api/auth/login', {
			body: {
				token: 'token123',
				type: 'Bearer',
				id: 123,
				username: 'regularUser',
				firstName: 'Regular',
				lastName: 'User',
				admin: false
			},
		}).as('login');

		const initialSession = {
			id: 42,
			name: 'evening calm',
			description: 'Initial session',
			date: '2025-12-19T07:50:30.392Z',
			teacher_id: 1,
			users: [],
			createdAt: '2025-12-19T07:50:30.392Z',
			updatedAt: '2025-12-19T07:50:30.392Z'
		};

		const joinedSession = { ...initialSession, users: [123] };

		// return different responses for subsequent GETs: first -> not joined, later -> joined
		let getCount = 0;
		cy.intercept('GET', '/api/session/42', (req) => {
			getCount += 1;
			if (getCount === 1) req.reply({ body: initialSession });
			else req.reply({ body: joinedSession });
		}).as('getSession');

		cy.intercept('GET', '/api/teacher/1', {
			body: {
				id: 1,
				lastName: 'Smith',
				firstName: 'Taylor',
				createdAt: '2025-12-19T07:50:30.392Z',
				updatedAt: '2025-12-19T07:50:30.392Z'
			}
		}).as('getTeacher');

		// stub sessions list
		cy.intercept('GET', '/api/session', {
			body: [initialSession]
		}).as('sessionsList');

		cy.intercept('POST', '/api/session/42/participate/123', {
			statusCode: 200,
			body: {}
		}).as('participate');

        cy.intercept('DELETE', '/api/session/42/participate/123', { 
            statusCode: 200, 
            body: {} 
        }).as('unParticipate');

		// login
		cy.get('input[formControlName=email]').type('yoga@studio.com');
		cy.get('input[formControlName=password]').type('test!1234');
        cy.get('button[type=submit]').click();
		cy.wait('@login');
		cy.wait('@sessionsList');

		// click Detail button to navigate to session detail
		cy.get('button').contains('Detail').first().click();
		cy.wait('@getSession');
		cy.wait('@getTeacher');

		// should show Participate button for non-member
		cy.get('button').contains('Participate').should('be.visible').click();
		cy.wait('@participate');

		// after participate flow the UI should update (second GET returns joined session)
		cy.wait('@getSession');
		cy.get('button').contains('Do not participate').should('be.visible').click();

		// un-participate request should be sent and UI should update again
		cy.wait('@unParticipate');
	});
});

