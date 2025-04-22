import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class RoleGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    const requiredRole = route.data['role']; // Rôle requis
    const userRole = this.authService.getUserRole(); // Rôle de l'utilisateur

    if (userRole === requiredRole) {
      return true; // Autoriser l'accès
    } else {
      this.router.navigate(['/login']); // Rediriger vers la page de connexion
      return false;
    }
  }
}