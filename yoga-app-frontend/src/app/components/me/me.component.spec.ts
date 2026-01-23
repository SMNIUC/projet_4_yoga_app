import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { of, Subject } from 'rxjs';
import { expect } from '@jest/globals';
import { SessionService } from 'src/app/core/service/session.service';
import { UserService } from 'src/app/core/service/user.service';
import { MeComponent } from './me.component';
import { CommonModule } from "@angular/common";
import { NoopAnimationsModule } from "@angular/platform-browser/animations";
import { NO_ERRORS_SCHEMA } from "@angular/core";
import { User } from "../../core/models/user.interface";
import { provideHttpClientTesting } from "@angular/common/http/testing";
import { provideHttpClient } from "@angular/common/http";

/* -------------------------------------------------------------------------- */
/*                                  Test data                                 */
/* -------------------------------------------------------------------------- */

const userMock = {
  id: 123,
  email: 'john.doe@email.com',
  lastName: 'Doe',
  firstName: 'John',
  admin: true,
  password: 'password',
  createdAt: new Date('2025-12-19T07:50:30.392Z'),
  updatedAt: new Date('2025-12-19T07:50:30.392Z'),
};

const sessionServiceMock = {
  sessionInformation: { id: 123 },
  logOut: jest.fn(),
};

const routerMock = {
  navigate: jest.fn(),
};

/* -------------------------------------------------------------------------- */
/*                                 Test suite                                 */
/* -------------------------------------------------------------------------- */

describe('MeComponent', () => {
  let component: MeComponent;
  let fixture: ComponentFixture<MeComponent>;

  /* ======================================================================== */
  /*                                Unit tests                                */
  /* ======================================================================== */

  describe('Unit Tests', () => {
    const userServiceMock = {
      getById: jest.fn(),
      delete: jest.fn(),
    };

    const snackBarMock = {
      open: jest.fn(),
    };

    beforeEach(async () => {
      routerMock.navigate.mockReset();

      userServiceMock.getById.mockReturnValue(of(userMock));
      userServiceMock.delete.mockReturnValue(of({}));

      await TestBed.configureTestingModule({
        imports: [
          MeComponent,
          NoopAnimationsModule,
        ],
        providers: [
          { provide: UserService, useValue: userServiceMock },
          { provide: SessionService, useValue: sessionServiceMock },
          { provide: Router, useValue: routerMock },
          { provide: MatSnackBar, useValue: snackBarMock },
        ],
      })
        // Remove MaterialModule & FlexLayoutModule to avoid Error: Could not parse CSS stylesheet
        .overrideComponent(MeComponent, {
          set: {
            imports: [CommonModule],
            schemas: [NO_ERRORS_SCHEMA],
          },
        })
        .compileComponents();

      fixture = TestBed.createComponent(MeComponent);
      component = fixture.componentInstance;
    });

    it('should create', () => {
      expect(component).toBeDefined();
    });

    it('should load the user on init', () => {
      component.ngOnInit();

      expect(userServiceMock.getById).toHaveBeenCalledWith('123');
      expect(component.user).toEqual(userMock);
    });

    it('should navigate back using browser history', () => {
      const historyBackSpy = jest.spyOn(globalThis.history, 'back');

      component.back();

      expect(historyBackSpy).toHaveBeenCalled();
    });

    it('should call delete on user service', () => {
      component.delete();

      expect(userServiceMock.delete).toHaveBeenCalledWith('123');
    });

    it('should logout, show snackbar, and navigate on delete success', () => {
      component.delete();

      expect(snackBarMock.open).toHaveBeenCalledWith(
        'Your account has been deleted !',
        'Close',
        { duration: 3000 }
      );

      expect(sessionServiceMock.logOut).toHaveBeenCalled();
      expect(routerMock.navigate).toHaveBeenCalledWith(['/']);
    });
  });

  /* ======================================================================== */
  /*                             Integration tests                            */
  /* ======================================================================== */

  describe('Integration Tests', () => {
    let userService: UserService;

    beforeEach(async () => {
      routerMock.navigate.mockReset();

      await TestBed.configureTestingModule({
        imports: [
          MeComponent,
          NoopAnimationsModule,
        ],
        providers: [
          provideHttpClient(),
          provideHttpClientTesting(),
          SessionService,
          { provide: SessionService, useValue: sessionServiceMock },
          UserService,
          { provide: Router, useValue: routerMock },
        ],
      })
        // Remove MaterialModule & FlexLayoutModule to avoid Error: Could not parse CSS stylesheet
        .overrideComponent(MeComponent, {
          set: {
            imports: [CommonModule],
            schemas: [NO_ERRORS_SCHEMA],
          },
        })
        .compileComponents();

      fixture = TestBed.createComponent(MeComponent);
      component = fixture.componentInstance;
      userService = TestBed.inject(UserService);
    });

    it('should create', () => {
      expect(component).toBeDefined();
    });

    it('should bind user from observable on init', () => {
      jest.spyOn(userService, 'getById').mockReturnValue(of(userMock));

      fixture.detectChanges();

      expect(component.user).toEqual(userMock);
    });

    it('should unsubscribe on destroy', () => {
      const subject$ = new Subject<User>();
      jest.spyOn(userService, 'getById').mockReturnValue(subject$);

      fixture.detectChanges();
      fixture.destroy();

      subject$.next(userMock);

      expect(component.user).toBeUndefined();
    });

    it('should complete delete flow with snackbar and navigation', () => {
      jest.spyOn(userService, 'delete').mockReturnValue(of({}));

      component.delete();

      expect(routerMock.navigate).toHaveBeenCalledWith(['/']);
    });
  });
});
