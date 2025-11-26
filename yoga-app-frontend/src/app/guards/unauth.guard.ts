import { inject, Injectable } from "@angular/core";
import { CanActivate, Router } from "@angular/router";
import { SessionService } from "../core/service/session.service";

@Injectable({providedIn: 'root'})
export class UnauthGuard implements CanActivate {

  private readonly sessionService = inject(SessionService);
  private readonly router = inject(Router);

  public canActivate(): boolean {
    if (this.sessionService.isLogged) {
      this.router.navigate(['rentals']);
      return false;
    }
    return true;
  }
}
