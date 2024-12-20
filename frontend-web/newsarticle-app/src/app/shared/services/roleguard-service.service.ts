import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuthService } from '@services/auth-service.service';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const expectedRoles: string[] = route.data['expectedRoles'];
    const currentRole = this.authService.roleSubject.value;

    if (expectedRoles.includes(currentRole) || currentRole === 'admin') {
      return true;
    } else {
      this.router.navigate(['/security/login']);
      return false;
    }
  }
}
