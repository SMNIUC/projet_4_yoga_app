import { provideHttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { expect } from '@jest/globals';
import { TeacherService } from './teacher.service';
import { HttpTestingController, provideHttpClientTesting } from "@angular/common/http/testing";
import { Teacher } from "../models/teacher.interface";

describe('TeacherService', () => {
  let service: TeacherService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        TeacherService
      ],
    });

    httpMock = TestBed.inject(HttpTestingController);
    service = TestBed.inject(TeacherService);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch all teachers', () => {
    const dummyTeachers: Teacher[] = [
      { id: 1, lastName: 'John', firstName: 'Doe', createdAt: new Date(), updatedAt: new Date() },
      { id: 2, lastName: 'Jane', firstName: 'Smith', createdAt: new Date(), updatedAt:  new Date() }
    ];

    service.all().subscribe(teachers => {
      expect(teachers.length).toBe(2);
      expect(teachers).toEqual(dummyTeachers);
    });

    const req = httpMock.expectOne('api/teacher');
    expect(req.request.method).toBe('GET');
    req.flush(dummyTeachers);
  });

  it('should fetch teacher detail by ID', () => {
    const dummyTeacher: Teacher = { id: 1, lastName: 'John', firstName: 'Doe', createdAt: new Date(), updatedAt: new Date() };

    service.detail('1').subscribe(teacher => {
      expect(teacher).toEqual(dummyTeacher);
    });

    const req = httpMock.expectOne('api/teacher/1');
    expect(req.request.method).toBe('GET');
    req.flush(dummyTeacher);
  });
});
