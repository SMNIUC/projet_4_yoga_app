import { ComponentFixture, TestBed } from '@angular/core/testing';
import { expect } from '@jest/globals';
import { SessionService } from 'src/app/core/service/session.service';
import { ListComponent } from './list.component';
import { Session } from "../../../../core/models/session.interface";
import { SessionInformation } from "../../../../core/models/sessionInformation.interface";
import { of } from "rxjs";
import { SessionApiService } from "../../../../core/service/session-api.service";
import { CommonModule } from "@angular/common";
import { NO_ERRORS_SCHEMA } from "@angular/core";
import { HttpTestingController, provideHttpClientTesting } from "@angular/common/http/testing";
import { provideHttpClient } from "@angular/common/http";

/* -------------------------------------------------------------------------- */
/*                                  Test data                                 */
/* -------------------------------------------------------------------------- */

const yogaSessionsMock: Session[] = [
  {
    id: 1,
    name: 'Morning Yoga',
    description: 'Relaxing session',
    date: new Date('2025-01-10'),
    teacher_id: 1,
    users: [123],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 2,
    name: 'Evening Yoga',
    description: 'Advanced session',
    date: new Date('2025-01-11'),
    teacher_id: 2,
    users: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

const sessionInformationMock: SessionInformation = {
  token: '0123456789',
  type: 'session',
  id: 123,
  username: 'username',
  firstName: 'firstName',
  lastName: 'lastName',
  admin: true,
};

/* -------------------------------------------------------------------------- */
/*                                 Test suite                                 */
/* -------------------------------------------------------------------------- */


describe('ListComponent', () => {
  let component: ListComponent;
  let fixture: ComponentFixture<ListComponent>;

  /* ======================================================================== */
  /*                                Unit tests                                */
  /* ======================================================================== */

  describe('Unit Tests', () => {
    const sessionApiServiceMock = {
      all: jest.fn(),
    };

    const sessionServiceMock: { sessionInformation?: SessionInformation } = {
      sessionInformation: sessionInformationMock,
    };

    beforeEach(async () => {
      sessionApiServiceMock.all.mockReturnValue(of(yogaSessionsMock));

      await TestBed.configureTestingModule({
        imports: [
          ListComponent,
        ],
        providers: [
          { provide: SessionApiService, useValue: sessionApiServiceMock },
          { provide: SessionService, useValue: sessionServiceMock },
        ],
      })
        // Remove MaterialModule & FlexLayoutModule to avoid Error: Could not parse CSS stylesheet
        .overrideComponent(ListComponent, {
          set: {
            imports: [CommonModule],
            schemas: [NO_ERRORS_SCHEMA],
          },
        })
        .compileComponents();

      fixture = TestBed.createComponent(ListComponent);
      component = fixture.componentInstance;
    });

    it('should create the component', () => {
      expect(component).toBeDefined();
    });

    it('should initialize sessions$ observable', (done) => {
      component.sessions$.subscribe((sessions) => {
        expect(sessions).toEqual(yogaSessionsMock);
        done();
      });

      expect(sessionApiServiceMock.all).toHaveBeenCalled();
    });

    it('should expose user from SessionService', () => {
      expect(component.user).toEqual(sessionInformationMock);
    });

    it('should return undefined user if sessionService has no sessionInformation', () => {
      sessionServiceMock.sessionInformation = undefined;

      expect(component.user).toBeUndefined();
    });
  });

  /* ======================================================================== */
  /*                             Integration tests                            */
  /* ======================================================================== */

  describe('Integration Tests', () => {
    let httpMock: HttpTestingController;

    const sessionServiceMock: { sessionInformation?: SessionInformation } = {
      sessionInformation: sessionInformationMock,
    };

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [
          ListComponent,
        ],
        providers: [
          provideHttpClient(),
          provideHttpClientTesting(),
          { provide: SessionService, useValue: sessionServiceMock },
        ],
      })
        .overrideComponent(ListComponent, {
          set: {
            imports: [CommonModule],
            schemas: [NO_ERRORS_SCHEMA],
          },
        })
        .compileComponents();

      fixture = TestBed.createComponent(ListComponent);
      component = fixture.componentInstance;

      httpMock = TestBed.inject(HttpTestingController);
    });

    afterEach(() => {
      httpMock.verify();
    });

    it('should create the component', () => {
      expect(component).toBeDefined();
    });

    it('should fetch sessions from API on initialization', (done) => {
      component.sessions$.subscribe((sessions) => {
        expect(sessions).toEqual(yogaSessionsMock);
        done();
      });

      const req = httpMock.expectOne('api/session');
      expect(req.request.method).toBe('GET');

      req.flush(yogaSessionsMock);
    });

    it('should expose sessionInformation from SessionService', () => {
      expect(component.user).toEqual(sessionInformationMock);
    });

    it('should return undefined user if sessionInformation is missing', () => {
      sessionServiceMock.sessionInformation = undefined;

      expect(component.user).toBeUndefined();
    });
  });
});
