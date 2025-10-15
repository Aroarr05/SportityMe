import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../auth/services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <nav class="navbar navbar-expand-lg navbar-dark bg-primary">
      <div class="container">
        <a class="navbar-brand" routerLink="/">
          <i class="fas fa-running me-2"></i>SportifyMe
        </a>

        <div class="navbar-nav ms-auto">
         
          @if (!authService.isLoggedIn()) {
            <a class="nav-link" routerLink="/auth/registro">Registrarse</a>
          }
          
          @if (authService.isLoggedIn()) {
            <span class="navbar-text me-3">Hola, {{ authService.getCurrentUser()?.nombre }}</span>
            <button class="btn btn-outline-light btn-sm" (click)="onLogout()">Cerrar Sesión</button>
          }
        </div>
      </div>
    </nav>
  `
})

export class NavbarComponent {
  constructor(public authService: AuthService) {}

  onLogout() {
    this.authService.logout();
  }
}