import { ComponentFixture, TestBed } from '@angular/core/testing';
import { expect } from '@jest/globals';
import { AppComponent } from './app.component';
import { Router} from "@angular/router";
import { SessionService } from "./core/service/session.service";
import { of } from "rxjs";

/* -------------------------------------------------------------------------- */
/*                                  Test data                                 */
/* -------------------------------------------------------------------------- */

const sessionServiceMock = {
  $isLogged: jest.fn(),
  logOut: jest.fn(),
};

const routerMock = {
  navigate: jest.fn(),
};

/* -------------------------------------------------------------------------- */
/*                                 Test suite                                 */
/* -------------------------------------------------------------------------- */

describe('AppComponent', () => {
  let app: AppComponent;
  let fixture: ComponentFixture<AppComponent>;

  beforeEach(async () => {
    routerMock.navigate.mockReset();

    await TestBed.configureTestingModule({
      imports: [
        AppComponent,
      ],
      providers: [
        { provide: Router, useValue: routerMock },
        { provide: SessionService, useValue: sessionServiceMock },
      ],
    })
      .compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    app = fixture.componentInstance;
  });

  it('should create the app', () => {
    expect(app).toBeDefined();
  });

  it('should return login status from SessionService', (done) => {
    sessionServiceMock.$isLogged.mockReturnValue(of(true));

    app.$isLogged().subscribe((isLogged) => {
      expect(isLogged).toBe(true);
      expect(sessionServiceMock.$isLogged).toHaveBeenCalledTimes(1);
      done();
    });
  });

  it('should log out and navigate to home', () => {
    app.logout();

    expect(sessionServiceMock.logOut).toHaveBeenCalledTimes(1);
    expect(routerMock.navigate).toHaveBeenCalledWith(['']);
  });
});
