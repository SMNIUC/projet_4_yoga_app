import { provideHttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { expect } from '@jest/globals';
import { SessionApiService } from './session-api.service';
import { HttpTestingController, provideHttpClientTesting } from "@angular/common/http/testing";
import { Session } from "../models/session.interface";

describe('SessionsService', () => {
  let service: SessionApiService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        SessionApiService
      ],
    });

    httpMock = TestBed.inject(HttpTestingController);
    service = TestBed.inject(SessionApiService);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch all sessions', () => {
    const dummySessions: Session[] = [
      { id: 1, name: 'Yoga Nidra', description: 'Yoga Nidra', date: new Date(), teacher_id: 1, users: [1, 2], createdAt: new Date(), updatedAt: new Date() },
      { id: 2, name: 'Yoga Massala', description: 'Yoga Massala', date: new Date(), teacher_id: 1, users: [1, 2], createdAt: new Date(), updatedAt: new Date() }
    ];

    service.all().subscribe(sessions => {
      expect(sessions.length).toBe(2);
      expect(sessions).toEqual(dummySessions);
    });

    const req = httpMock.expectOne('api/session');
    expect(req.request.method).toBe('GET');
    req.flush(dummySessions);
  });

  it('should fetch session detail by ID', () => {
    const dummySession: Session = { id: 1, name: 'Yoga Nidra', description: 'Yoga Nidra', date: new Date(), teacher_id: 1, users: [1, 2], createdAt: new Date(), updatedAt: new Date() };

    service.detail('1').subscribe(session => {
      expect(session).toEqual(dummySession);
    });

    const req = httpMock.expectOne('api/session/1');
    expect(req.request.method).toBe('GET');
    req.flush(dummySession);
  });

  it('should delete a session', () => {
    service.delete('1').subscribe(response => {
      expect(response).toBeTruthy();
    });

    const req = httpMock.expectOne('api/session/1');
    expect(req.request.method).toBe('DELETE');
    req.flush({});
  });

  it('should create a session', () => {
    const newSession: Session = { id: 3, name: 'Yoga Yuna', description: 'Yoga Yuna', date: new Date(), teacher_id: 1, users: [1, 2], createdAt: new Date(), updatedAt: new Date() };

    service.create(newSession).subscribe(session => {
      expect(session).toEqual(newSession);
    });

    const req = httpMock.expectOne('api/session');
    expect(req.request.method).toBe('POST');
    req.flush(newSession);
  });

  it('should update a session', () => {
    const updatedSession: Session = { id: 1, name: 'Updated Yoga Nidra', description: 'Updated Yoga Nidra', date: new Date(), teacher_id: 1, users: [1, 2], createdAt: new Date(), updatedAt: new Date() };

    service.update('1', updatedSession).subscribe(session => {
      expect(session).toEqual(updatedSession);
    });

    const req = httpMock.expectOne('api/session/1');
    expect(req.request.method).toBe('PUT');
    req.flush(updatedSession);
  });

  it('should participate in a session', () => {
    service.participate('1', 'user1').subscribe(() => {
      // No assertion needed, just ensuring the request goes through
    });

    const req = httpMock.expectOne('api/session/1/participate/user1');
    expect(req.request.method).toBe('POST');
    req.flush(null);
  });

  it('should un-participate from a session', () => {
    service.unParticipate('1', 'user1').subscribe(() => {
      // No assertion needed, just ensuring the request goes through
    });

    const req = httpMock.expectOne('api/session/1/participate/user1');
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });
});
