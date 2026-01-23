import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { expect } from '@jest/globals';
import { RegisterComponent } from './register.component';
import { MaterialModule } from "../../shared/material.module";
import { AuthService } from "../../core/service/auth.service";
import { Router } from "@angular/router";
import { provideHttpClient } from "@angular/common/http";
import { HttpTestingController, provideHttpClientTesting } from "@angular/common/http/testing";
import { NO_ERRORS_SCHEMA } from "@angular/core";
import { CommonModule } from "@angular/common";
import { of, throwError } from "rxjs";

/* -------------------------------------------------------------------------- */
/*                                  Test data                                 */
/* -------------------------------------------------------------------------- */

const validFormData = {
  email: 'test@example.com',
  firstName: 'John',
  lastName: 'Doe',
  password: 'password123',
};

const routerMock = {
  navigate: jest.fn(),
};

const authServiceMock = {
  register: jest.fn(),
};

/* -------------------------------------------------------------------------- */
/*                                 Test suite                                 */
/* -------------------------------------------------------------------------- */

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;

  /* ======================================================================== */
  /*                                Unit tests                                */
  /* ======================================================================== */

  describe('Unit Tests', () => {
    beforeEach(async () => {
      authServiceMock.register.mockReset();
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
          { provide: AuthService, useValue: authServiceMock },
          { provide: Router, useValue: routerMock },
        ],
      })
        // Remove MaterialModule & FlexLayoutModule to avoid Error: Could not parse CSS stylesheet
        .overrideComponent(RegisterComponent, {
          set: {
            imports: [CommonModule],
            schemas: [NO_ERRORS_SCHEMA],
          },
        })
        .compileComponents();

      fixture = TestBed.createComponent(RegisterComponent);
      component = fixture.componentInstance;
    });

    it('should create the component', () => {
      expect(component).toBeDefined();
    });

    it('should initialize the form with empty values', () => {
      const form = component.form;
      expect(form.value).toEqual({
        email: '',
        firstName: '',
        lastName: '',
        password: '',
      });
      expect(form.valid).toBe(false);
    });

    it('should mark form as valid when valid data is set', () => {
      component.form.setValue(validFormData);
      expect(component.form.valid).toBe(true);
    });

    it('should submit and navigate to /login on success', () => {
      component.form.setValue(validFormData);
      authServiceMock.register.mockReturnValue(of({}));

      component.submit();

      expect(authServiceMock.register).toHaveBeenCalledWith(validFormData);
      expect(routerMock.navigate).toHaveBeenCalledWith(['/login']);
      expect(component.onError).toBe(false);
    });

    it('should handle error from authService and set onError and error message', () => {
      component.form.setValue(validFormData);
      const errorResponse = { error: { message: 'Email already exists' } };
      authServiceMock.register.mockReturnValue(throwError(() => errorResponse));

      component.submit();

      expect(authServiceMock.register).toHaveBeenCalledWith(validFormData);
      expect(component.onError).toBe(true);
      expect(component.error).toBe('Email already exists');
    });

    it('should handle error without error.message field', () => {
      component.form.setValue(validFormData);
      const errorResponse = { message: 'Network error' };
      authServiceMock.register.mockReturnValue(throwError(() => errorResponse));

      component.submit();

      expect(component.onError).toBe(true);
      expect(component.error).toBe('Network error');
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
          { provide: Router, useValue: routerMock },
        ],
      })
        // Remove MaterialModule & FlexLayoutModule to avoid Error: Could not parse CSS stylesheet
        .overrideComponent(RegisterComponent, {
          set: {
            imports: [CommonModule],
            schemas: [NO_ERRORS_SCHEMA],
          },
        })
        .compileComponents();

      fixture = TestBed.createComponent(RegisterComponent);
      component = fixture.componentInstance;

      httpMock = TestBed.inject(HttpTestingController);
    });

    afterEach(() => {
      httpMock.verify();
    });

    it('should call auth API and navigate on success', () => {
      component.form.setValue(validFormData);
      component.submit();

      const req = httpMock.expectOne('/api/auth/register');
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(validFormData);

      req.flush({});
      expect(routerMock.navigate).toHaveBeenCalledWith(['/login']);
    });

    it('should set onError and error message when API fails', () => {
      component.form.setValue(validFormData);
      component.submit();

      const req = httpMock.expectOne('/api/auth/register');
      req.flush({ message: 'Server error' }, { status: 500, statusText: 'Internal Server Error' });

      expect(component.onError).toBe(true);
      expect(component.error).toBe('Server error');
      expect(routerMock.navigate).not.toHaveBeenCalled();
    });
  });
});
