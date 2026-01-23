import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { expect } from '@jest/globals';
import { SessionService } from 'src/app/core/service/session.service';
import { SessionApiService } from '../../../../core/service/session-api.service';
import { FormComponent } from './form.component';
import { of } from "rxjs";
import { TeacherService } from "../../../../core/service/teacher.service";
import { ActivatedRoute, Router } from "@angular/router";
import { CommonModule } from "@angular/common";
import { NO_ERRORS_SCHEMA } from "@angular/core";
import { provideHttpClient } from "@angular/common/http";
import { HttpTestingController, provideHttpClientTesting } from "@angular/common/http/testing";
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { Teacher } from "../../../../core/models/teacher.interface";

/* -------------------------------------------------------------------------- */
/*                                  Test data                                 */
/* -------------------------------------------------------------------------- */

const yogaTeacherMock: Teacher = {
  id: 1,
  lastName: 'testLastName',
  firstName: 'testFirstName',
  createdAt: new Date('2025-12-19T07:50:30.392Z'),
  updatedAt: new Date('2025-12-19T07:50:30.392Z'),
};

const activatedRouteMock = {
  snapshot: {
    paramMap: {
      get: jest.fn().mockReturnValue('42'),
    },
  },
};

const sessionServiceMock = {
  sessionInformation: {
    admin: true,
  },
};

const snackBarMock = {
  open: jest.fn(),
};

const routerMock = {
  navigate: jest.fn(),
  url: '',
};

/* -------------------------------------------------------------------------- */
/*                                 Test suite                                 */
/* -------------------------------------------------------------------------- */

describe('FormComponent', () => {
  let component: FormComponent;
  let fixture: ComponentFixture<FormComponent>;

  let formBuilder: FormBuilder;
  let newFormGroup: FormGroup;
  let updatedFormGroup: FormGroup;

  /* ======================================================================== */
  /*                                Unit tests                                */
  /* ======================================================================== */

  describe('Unit Tests', () => {
    const sessionApiServiceMock = {
      detail: jest.fn(),
      update: jest.fn(),
      create: jest.fn(),
    };

    const yogaSessionMock = {
      name: 'test',
      description: 'test description',
      date: new Date('2025-12-19T07:50:30.392Z').toISOString().split('T')[0],
      teacher_id: 1,
    };

    const updatedYogaSessionMock = {
      name: 'updated test',
      description: 'updated test description',
      date: new Date('2026-01-12T07:50:30.392Z').toISOString().split('T')[0],
      teacher_id: 2,
    };

    const teacherServiceMock = {
      all: jest.fn(),
    };

    beforeEach(async () => {
      routerMock.navigate.mockReset();

      sessionApiServiceMock.detail.mockReturnValue(of(yogaSessionMock));
      sessionApiServiceMock.update.mockReturnValue(of({updatedYogaSessionMock}));
      sessionApiServiceMock.create.mockReturnValue(of({yogaSessionMock}));

      formBuilder = new FormBuilder();

      updatedFormGroup = formBuilder.group({
        name: [updatedYogaSessionMock.name, Validators.required],
        date: [updatedYogaSessionMock.date, Validators.required],
        teacher_id: [updatedYogaSessionMock.teacher_id, Validators.required],
        description: [updatedYogaSessionMock.description, [
          Validators.required,
          Validators.maxLength(2000),
        ]],
      });

      newFormGroup = formBuilder.group({
        name: [yogaSessionMock.name, Validators.required],
        date: [yogaSessionMock.date, Validators.required],
        teacher_id: [yogaSessionMock.teacher_id, Validators.required],
        description: [yogaSessionMock.description, [
          Validators.required,
          Validators.maxLength(2000),
        ]],
      });

      teacherServiceMock.all.mockReturnValue(of([yogaTeacherMock]));

      await TestBed.configureTestingModule({
        imports: [
          ReactiveFormsModule,
          FormComponent,
          NoopAnimationsModule,
        ],
        providers: [
          { provide: ActivatedRoute, useValue: activatedRouteMock },
          { provide: Router, useValue: routerMock },
          { provide: MatSnackBar, useValue: snackBarMock },
          { provide: SessionService, useValue: sessionServiceMock },
          { provide: SessionApiService, useValue: sessionApiServiceMock },
          { provide: TeacherService, useValue: teacherServiceMock },
        ],
      })
        // Remove MaterialModule & FlexLayoutModule to avoid Error: Could not parse CSS stylesheet
        .overrideComponent(FormComponent, {
          set: {
            imports: [CommonModule],
            schemas: [NO_ERRORS_SCHEMA],
          },
        })
        .compileComponents();

      fixture = TestBed.createComponent(FormComponent);
      component = fixture.componentInstance;
    });

    it('should create', () => {
      expect(component).toBeDefined();
    });

    it('should navigate to sessions page if user is NOT Admin', () => {
      sessionServiceMock.sessionInformation.admin = false;
      component.ngOnInit();

      expect(routerMock.navigate).toHaveBeenCalledWith(['/sessions']);
    });

    it('should initialize onUpdate and id, and call sessionApiService and initForm if url = update', () => {
      const fetchSpy = jest.spyOn(component as any, 'initForm');
      routerMock.url = 'update';
      component.ngOnInit();

      expect(component.onUpdate).toBe(true);
      expect(activatedRouteMock.snapshot.paramMap.get()).toBe('42');
      expect(sessionApiServiceMock.detail).toHaveBeenCalledWith('42');
      expect(fetchSpy).toHaveBeenCalledWith(yogaSessionMock);
    });

    it('should call initForm and populate form with correct session information', () => {
      routerMock.url = 'update';
      component.ngOnInit();

      expect(component.sessionForm?.get('name')?.value).toEqual(newFormGroup.get('name')?.value);
      expect(component.sessionForm?.get('date')?.value).toEqual(newFormGroup.get('date')?.value);
      expect(component.sessionForm?.get('teacher_id')?.value).toEqual(newFormGroup.get('teacher_id')?.value);
      expect(component.sessionForm?.get('description')?.value).toEqual(newFormGroup.get('description')?.value);
    });

    it('should call initForm and initialize a blank form if url != update', () => {
      const fetchSpy = jest.spyOn(component as any, 'initForm');
      routerMock.url = '';
      component.ngOnInit();

      expect(fetchSpy).toHaveBeenCalled();
      expect(component.sessionForm).toBeDefined();
    })

    it('should update the yoga session details', () => {
      const fetchSpy = jest.spyOn(component as any, 'exitPage');

      routerMock.url = 'update';
      component.ngOnInit();
      component.sessionForm = updatedFormGroup;
      component.submit();

      expect(sessionApiServiceMock.update).toHaveBeenCalledWith('42', updatedYogaSessionMock);
      expect(fetchSpy).toHaveBeenCalledWith('Session updated !');
    });

    it('should show snackbar and navigate to sessions page upon yoga session update', () => {
      component.onUpdate = true;
      component.submit();

      expect(snackBarMock.open).toHaveBeenCalledWith(
        'Session updated !',
        'Close',
        { duration: 3000 },
      );

      expect(routerMock.navigate).toHaveBeenCalledWith(['sessions']);
    });

    it('should create new yoga session details', () => {
      const fetchSpy = jest.spyOn(component as any, 'exitPage');

      routerMock.url = '';
      component.ngOnInit();
      component.sessionForm = newFormGroup;
      component.submit();

      expect(sessionApiServiceMock.create).toHaveBeenCalledWith(yogaSessionMock);
      expect(fetchSpy).toHaveBeenCalledWith('Session created !');
    });

    it('should show snackbar and navigate to sessions page upon yoga session creation', () => {
      component.onUpdate = false;
      component.submit();

      expect(snackBarMock.open).toHaveBeenCalledWith(
        'Session created !',
        'Close',
        { duration: 3000 },
      );

      expect(routerMock.navigate).toHaveBeenCalledWith(['sessions']);
    });
  });

  /* ======================================================================== */
  /*                             Integration tests                            */
  /* ======================================================================== */

  describe('Integration Tests', () => {
    let httpMock: HttpTestingController;

    const yogaSessionMock = {
      id: 42,
      name: 'test',
      description: 'test description',
      date: new Date('2025-12-19T07:50:30.392Z').toISOString().split('T')[0],
      teacher_id: 1,
      users: [123],
      created_at: new Date('2025-12-19T07:50:30.392Z'),
      updated_at: new Date('2025-12-19T07:50:30.392Z'),
    };

    beforeEach(async () => {
      routerMock.navigate.mockClear();

      await TestBed.configureTestingModule({
        imports: [
          FormComponent,
          NoopAnimationsModule,
        ],
        providers: [
          provideHttpClient(),
          provideHttpClientTesting(),
          { provide: SessionService, useValue: sessionServiceMock },
          { provide: MatSnackBar, useValue: snackBarMock },
          { provide: Router, useValue: routerMock },
          { provide: ActivatedRoute, useValue: activatedRouteMock },
        ],
      })
        // Remove MaterialModule & FlexLayoutModule to avoid Error: Could not parse CSS stylesheet
        .overrideComponent(FormComponent, {
          set: {
            imports: [CommonModule],
            schemas: [NO_ERRORS_SCHEMA],
          },
        })
        .compileComponents();

      fixture = TestBed.createComponent(FormComponent);
      component = fixture.componentInstance;

      httpMock = TestBed.inject(HttpTestingController);
    });

    afterEach(() => {
      httpMock.verify();
    });

    it('should create', () => {
      expect(component).toBeDefined();
    });

    it('should fetch session details and populate the form in update mode', () => {
      routerMock.url = '/sessions/update/42';

      component.ngOnInit();

      const req = httpMock.expectOne('api/session/42');
      expect(req.request.method).toBe('GET');

      req.flush(yogaSessionMock);

      expect(component.onUpdate).toBe(true);
      expect(component.sessionForm?.value).toEqual({
        name: yogaSessionMock.name,
        date: yogaSessionMock.date,
        teacher_id: yogaSessionMock.teacher_id,
        description: yogaSessionMock.description,
      });
    });

    it('should update session and navigate away', () => {
      routerMock.url = '/sessions/update/42';

      component.ngOnInit();

      httpMock.expectOne('api/session/42').flush(yogaSessionMock);

      component.sessionForm?.setValue({
        name: 'Updated name',
        date: '2026-01-12',
        teacher_id: 2,
        description: 'Updated desc',
      });

      component.submit();

      const req = httpMock.expectOne('api/session/42');
      expect(req.request.method).toBe('PUT');

      req.flush({});

      expect(routerMock.navigate).toHaveBeenCalledWith(['sessions']);
    });

    it('should create a new session and navigate away', () => {
      routerMock.url = '/sessions/create';

      component.ngOnInit();

      component.sessionForm?.setValue({
        name: 'New session',
        date: '2026-01-10',
        teacher_id: 1,
        description: 'New description',
      });

      component.submit();

      const req = httpMock.expectOne('api/session');
      expect(req.request.method).toBe('POST');
      expect(req.request.body.name).toBe('New session');

      req.flush({});

      expect(routerMock.navigate).toHaveBeenCalledWith(['sessions']);
    });

    it('should redirect non-admin users', () => {
      sessionServiceMock.sessionInformation.admin = false;

      component.ngOnInit();

      expect(routerMock.navigate).toHaveBeenCalledWith(['/sessions']);
    });
  });
});
