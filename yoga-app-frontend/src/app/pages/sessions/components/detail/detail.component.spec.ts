import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatSnackBar } from '@angular/material/snack-bar';
import { expect } from '@jest/globals';
import { SessionService } from '../../../../core/service/session.service';
import { DetailComponent } from './detail.component';
import { NoopAnimationsModule } from "@angular/platform-browser/animations";
import { ActivatedRoute, Router } from "@angular/router";
import { CommonModule } from "@angular/common";
import { NO_ERRORS_SCHEMA } from "@angular/core";
import { SessionApiService } from "../../../../core/service/session-api.service";
import { Session } from '../../../../core/models/session.interface';
import { Teacher } from '../../../../core/models/teacher.interface';
import { TeacherService } from "../../../../core/service/teacher.service";
import { of } from "rxjs";
import { provideHttpClient } from "@angular/common/http";
import { provideHttpClientTesting } from "@angular/common/http/testing";

/* -------------------------------------------------------------------------- */
/*                                  Test data                                 */
/* -------------------------------------------------------------------------- */

const yogaSessionMock: Session = {
  id: 42,
  name: 'test',
  description: 'test description',
  date: new Date('2025-12-19T07:50:30.392Z'),
  teacher_id: 1,
  users: [123],
  createdAt: new Date('2025-12-19T07:50:30.392Z'),
  updatedAt: new Date('2025-12-19T07:50:30.392Z'),
};

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
    id: 123,
  },
};

const snackBarMock = {
  open: jest.fn(),
};

const routerMock = {
  navigate: jest.fn(),
};

/* -------------------------------------------------------------------------- */
/*                                 Test suite                                 */
/* -------------------------------------------------------------------------- */

describe('DetailComponent', () => {
  let component: DetailComponent;
  let fixture: ComponentFixture<DetailComponent>;

  /* ======================================================================== */
  /*                                Unit tests                                */
  /* ======================================================================== */

  describe('Unit Tests', () => {
    const sessionApiServiceMock = {
      delete: jest.fn(),
      participate: jest.fn(),
      unParticipate: jest.fn(),
      detail: jest.fn(),
    };

    const teacherServiceMock = {
      detail: jest.fn(),
    };

    beforeEach(async () => {
      routerMock.navigate.mockReset();

      sessionApiServiceMock.detail.mockReturnValue(of(yogaSessionMock));
      sessionApiServiceMock.delete.mockReturnValue(of({}));
      sessionApiServiceMock.participate.mockReturnValue(of({}));
      sessionApiServiceMock.unParticipate.mockReturnValue(of({}));

      teacherServiceMock.detail.mockReturnValue(of(yogaTeacherMock));

      await TestBed.configureTestingModule({
        imports: [
          DetailComponent,
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
        .overrideComponent(DetailComponent, {
          set: {
            imports: [CommonModule],
            schemas: [NO_ERRORS_SCHEMA],
          },
        })
        .compileComponents();

      fixture = TestBed.createComponent(DetailComponent);
      component = fixture.componentInstance;
    });

    it('should create the component', () => {
      expect(component).toBeDefined();
    });

    it('should initialize sessionId, isAdmin, and userId correctly', () => {
      expect(component.sessionId).toBe('42');
      expect(component.isAdmin).toBe(true);
      expect(component.userId).toBe('123');
    });

    it('should load the yoga session information', () => {
      component.ngOnInit();

      expect(sessionApiServiceMock.detail).toHaveBeenCalledWith('42');
      expect(component.session).toEqual(yogaSessionMock);
      expect(component.isParticipate).toBe(true);
    });

    it('should load the yoga teacher information', () => {
      component.ngOnInit();

      expect(teacherServiceMock.detail).toHaveBeenCalledWith('1');
      expect(component.teacher).toEqual(yogaTeacherMock);
    });

    it('should set isParticipate to false if user is not in session', () => {
      sessionApiServiceMock.detail.mockReturnValueOnce(of({ ...yogaSessionMock, users: [999] }));

      component.ngOnInit();

      expect(component.isParticipate).toBe(false);
    });

    it('should navigate back using browser history', () => {
      const historyBackSpy = jest.spyOn(globalThis.history, 'back');

      component.back();

      expect(historyBackSpy).toHaveBeenCalled();
    });

    it('should call delete on session api service', () => {
      component.delete();

      expect(sessionApiServiceMock.delete).toHaveBeenCalledWith('42');
    });

    it('should show snackbar and navigate on delete success', () => {
      component.delete();

      expect(snackBarMock.open).toHaveBeenCalledWith(
        'Session deleted !',
        'Close',
        { duration: 3000 }
      );

      expect(routerMock.navigate).toHaveBeenCalledWith(['sessions']);
    });

    it('should reload session after participating', () => {
      sessionApiServiceMock.participate.mockReturnValueOnce(of({}));
      sessionApiServiceMock.detail.mockReturnValueOnce(of({ ...yogaSessionMock, users: [123, 456] }));

      component.participate();

      expect(sessionApiServiceMock.participate).toHaveBeenCalledWith('42', '123');
      expect(component.isParticipate).toBe(true);
    });

    it('should reload session after unParticipating', () => {
      sessionApiServiceMock.unParticipate.mockReturnValueOnce(of({}));
      sessionApiServiceMock.detail.mockReturnValueOnce(of({ ...yogaSessionMock, users: [] }));

      component.unParticipate();

      expect(sessionApiServiceMock.unParticipate).toHaveBeenCalledWith('42', '123');
      expect(component.isParticipate).toBe(false);
    });
  });

  /* ======================================================================== */
  /*                             Integration tests                            */
  /* ======================================================================== */

  describe('Integration Tests', () => {
    let sessionApiService: SessionApiService;
    let teacherService: TeacherService;

    beforeEach(async () => {
      routerMock.navigate.mockReset();

      await TestBed.configureTestingModule({
        imports: [
          DetailComponent,
          NoopAnimationsModule,
        ],
        providers: [
          provideHttpClient(),
          provideHttpClientTesting(),
          SessionApiService,
          TeacherService,
          { provide: SessionService, useValue: sessionServiceMock },
          { provide: ActivatedRoute, useValue: activatedRouteMock },
          { provide: MatSnackBar, useValue: snackBarMock },
          { provide: Router, useValue: routerMock },
        ],
      })
        // Remove MaterialModule & FlexLayoutModule to avoid Error: Could not parse CSS stylesheet
        .overrideComponent(DetailComponent, {
          set: {
            imports: [CommonModule],
            schemas: [NO_ERRORS_SCHEMA],
          },
        })
      .compileComponents();

      fixture = TestBed.createComponent(DetailComponent);
      component = fixture.componentInstance;

      sessionApiService = TestBed.inject(SessionApiService);
      teacherService = TestBed.inject(TeacherService);
    });

    it('should create the component', () => {
      expect(component).toBeDefined();
    });

    it('should bind session then teacher from observables on init', async () => {
      jest.spyOn(sessionApiService, 'detail').mockReturnValue(of(yogaSessionMock));
      jest.spyOn(teacherService, 'detail').mockReturnValue(of(yogaTeacherMock));

      fixture.detectChanges();
      await fixture.whenStable();

      expect(component.session).toEqual(yogaSessionMock);
      expect(component.teacher).toEqual(yogaTeacherMock);
    });

    it('should complete delete flow', () => {
      jest.spyOn(sessionApiService, 'delete').mockReturnValue(of({}));

      component.delete();

      expect(routerMock.navigate).toHaveBeenCalledWith(['sessions']);
    });
  });
});
