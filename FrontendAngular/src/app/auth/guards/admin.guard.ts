import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(): boolean {
    const isAdmin = this.authService.isAdmin();
    const isLoggedIn = this.authService.isLoggedIn();
    const currentUser = this.authService.getCurrentUser();

    console.log('🔐 Verificando acceso admin:', {
      isLoggedIn,
      isAdmin,
      currentUser: currentUser?.nombre,
      rolId: currentUser?.rol_id
    });

    if (!isLoggedIn) {
      console.log('❌ Usuario no autenticado, redirigiendo a login');
      this.router.navigate(['/auth/login']);
      return false;
    }

    if (!isAdmin) {
      console.log(' Usuario no es admin, redirigiendo a desafíos');
      this.router.navigate(['/desafios']);
      return false;
    }

    console.log('Acceso admin permitido');
    return true;
  }
}