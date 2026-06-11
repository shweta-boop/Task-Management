import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    _state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    if (this.authService.isAuthenticated()) {
      const user = this.authService.getCurrentUserValue();

      if (route.data['roles'] && !route.data['roles'].includes(user?.role)) {
        this.router.navigate(['/dashboard']);
        return false;
      }

      return true;
    }

    this.router.navigate(['/auth/login']);
    return false;
  }
}
