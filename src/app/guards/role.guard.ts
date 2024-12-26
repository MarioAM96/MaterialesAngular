import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {

  constructor(private router: Router) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): boolean {
    const storedRol = sessionStorage.getItem('authToken');
    const expectedRoles = next.data['expectedRoles'] as Array<string>;

    if (storedRol && expectedRoles.includes(storedRol)) {
      return true;
    } else {
      // Redirigir a una página de acceso denegado o a la página de inicio de sesión
      this.router.navigate(['/login']);
      return false;
    }
  }
}