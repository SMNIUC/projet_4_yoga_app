import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { expect } from '@jest/globals';
import { SessionService } from 'src/app/core/service/session.service';
import { LoginComponent } from './login.component';
import { MaterialModule } from "../../shared/material.module";
import { provideHttpClient } from "@angular/common/http";
import { HttpTestingController, provideHttpClientTesting } from "@angular/common/http/testing";
import { AuthService } from "../../core/service/auth.service";
import { Router } from "@angular/router";
import { CommonModule } from "@angular/common";
import { NO_ERRORS_SCHEMA } from "@angular/core";
import { of, throwError } from "rxjs";

/* -------------------------------------------------------------------------- */
/*                                  Test data                                 */
/* -------------------------------------------------------------------------- */

const validFormData = {
  email: 'test@example.com',
  password: 'password123',
};

const sessionServiceMock = {
  logIn: jest.fn(),
  sessionInformation: {
    token: 'test-token',
    type: 'test-type',
    id: 123,
    username: 'test-user',
    firstname: 'test-firstname',
    lastname: 'test-lastname',
    password: 'password123',
    admin: true,
  },
};

const routerMock = {
  navigate: jest.fn(),
};

const authServiceMock = {
  login: jest.fn(),
};

/* -------------------------------------------------------------------------- */
/*                                 Test suite                                 */
/* -------------------------------------------------------------------------- */

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;

  /* ======================================================================== */
  /*                                Unit tests                                */
  /* ======================================================================== */

  describe('Unit Tests', () => {
    beforeEach(async () => {
      authServiceMock.login.mockReset();
      routerMock.navigate.mockReset();

      await TestBed.configureTestingModule({
        imports: [
          ReactiveFormsModule,
          MaterialModule,
          NoopAnimationsModule,
        ],
        providers: [
          provideHttpClient(),
          provideHttpClientTesting(),
          FormBuilder,
          { provide: SessionService, useValue: sessionServiceMock },
          { provide: AuthService, useValue: authServiceMock },
          { provide: Router, useValue: routerMock },
        ],
      })
        // Remove MaterialModule & FlexLayoutModule to avoid Error: Could not parse CSS stylesheet
        .overrideComponent(LoginComponent, {
          set: {
            imports: [CommonModule],
            schemas: [NO_ERRORS_SCHEMA],
          },
        })
        .compileComponents();

      fixture = TestBed.createComponent(LoginComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    it('should create the component', () => {
      expect(component).toBeDefined();
    });

    it('should initialize the form with empty values', () => {
      const form = component.form;
      expect(form.value).toEqual({
        email: '',
        password: '',
      });
      expect(form.valid).toBe(false);
    });

    it('should mark form as valid when valid data is set', () => {
      component.form.setValue(validFormData);
      expect(component.form.valid).toBe(true);
    });

    it('should submit and navigate to /sessions on success', () => {
      component.form.setValue(validFormData);
      authServiceMock.login.mockReturnValue(of(sessionServiceMock.sessionInformation));

      component.submit();

      expect(authServiceMock.login).toHaveBeenCalledWith(validFormData);
      expect(routerMock.navigate).toHaveBeenCalledWith(['/sessions']);
      expect(sessionServiceMock.logIn).toHaveBeenCalledWith(sessionServiceMock.sessionInformation);
      expect(component.onError).toBe(false);
    });

    it('should handle error from authService and set onError and error message', () => {
      component.form.setValue(validFormData);
      const errorResponse = { error: { message: 'Email already exists' } };
      authServiceMock.login.mockReturnValue(throwError(() => errorResponse));

      component.submit();

      expect(authServiceMock.login).toHaveBeenCalledWith(validFormData);
      expect(component.onError).toBe(true);
    });

    it('should handle error without error.message field', () => {
      component.form.setValue(validFormData);
      const errorResponse = { message: 'Network error' };
      authServiceMock.login.mockReturnValue(throwError(() => errorResponse));

      component.submit();

      expect(component.onError).toBe(true);
    });
  });

  /* ======================================================================== */
  /*                             Integration tests                            */
  /* ======================================================================== */

  describe('Integration Tests', () => {
    let httpMock: HttpTestingController;

    beforeEach(async () => {
      routerMock.navigate.mockClear();

      await TestBed.configureTestingModule({
        imports: [
          ReactiveFormsModule,
          MaterialModule,
          NoopAnimationsModule,
        ],
        providers: [
          provideHttpClient(),
          provideHttpClientTesting(),
          FormBuilder,
          AuthService,
          { provide: SessionService, useValue: sessionServiceMock },
          { provide: Router, useValue: routerMock },
        ],
      })
        // Remove MaterialModule & FlexLayoutModule to avoid Error: Could not parse CSS stylesheet
        .overrideComponent(LoginComponent, {
          set: {
            imports: [CommonModule],
            schemas: [NO_ERRORS_SCHEMA],
          },
        })
        .compileComponents();

      fixture = TestBed.createComponent(LoginComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();

      httpMock = TestBed.inject(HttpTestingController);
    });

    afterEach(() => {
      httpMock.verify();
    });

    it('should call auth API and navigate on success', () => {
      component.form.setValue(validFormData);
      component.submit();

      const req = httpMock.expectOne('/api/auth/login');
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(validFormData);

      req.flush(sessionServiceMock.sessionInformation);
      expect(routerMock.navigate).toHaveBeenCalledWith(['/sessions']);
    });

    it('should set onError and error message when API fails', () => {
      component.form.setValue(validFormData);
      component.submit();

      const req = httpMock.expectOne('/api/auth/login');
      req.flush({ message: 'Server error' }, { status: 500, statusText: 'Internal Server Error' });

      expect(component.onError).toBe(true);
      expect(routerMock.navigate).not.toHaveBeenCalled();
    });
  });
});
