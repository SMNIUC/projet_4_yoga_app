import { TestBed } from '@angular/core/testing';
import { expect } from '@jest/globals';
import { SessionService } from './session.service';
import { SessionInformation } from '../models/sessionInformation.interface';

describe('SessionService', () => {
  let service: SessionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SessionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should start with isLogged as false', () => {
    expect(service.isLogged).toBe(false);
    expect(service.sessionInformation).toBeUndefined();
  });

  it('should log in a user and update isLogged state', () => {
    const user: SessionInformation = { token: '1234567890', type: 'type', id: 1, username: 'john.doe', firstName: 'John', lastName: 'Doe', admin: true };

    service.logIn(user);

    expect(service.isLogged).toBe(true);
    expect(service.sessionInformation).toEqual(user);
  });

  it('should emit isLogged as true when logged in', (done) => {
    const user: SessionInformation = { token: '1234567890', type: 'type', id: 1, username: 'john.doe', firstName: 'John', lastName: 'Doe', admin: true };

    service.$isLogged().subscribe(isLogged => {
      expect(isLogged).toBe(true);
      done();
    });

    service.logIn(user);
  });

  it('should log out a user and update isLogged state', () => {
    const user: SessionInformation = { token: '1234567890', type: 'type', id: 1, username: 'john.doe', firstName: 'John', lastName: 'Doe', admin: true };
    service.logIn(user);

    service.logOut();

    expect(service.isLogged).toBe(false);
    expect(service.sessionInformation).toBeUndefined();
  });

  it('should emit isLogged as false when logged out', (done) => {
    const user: SessionInformation = { token: '1234567890', type: 'type', id: 1, username: 'john.doe', firstName: 'John', lastName: 'Doe', admin: true };
    service.logIn(user);

    service.$isLogged().subscribe(isLogged => {
      expect(isLogged).toBe(false);
      done();
    });

    service.logOut();
  });
});
