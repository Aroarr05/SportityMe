import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { AuthService } from '../../../auth/services/auth.service';

@Component({
  standalone: true,
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss'],
  imports: [
    CommonModule,
    RouterModule
  ]
})

export class LayoutComponent implements OnInit {
  tituloPagina = 'SportifyMe';
  isLoggedIn = false;
  isAdmin = false;
  isAdminMenuOpen = false; 

  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        this.actualizarTitulo();
      });

    this.authService.isLoggedIn$.subscribe(loggedIn => {
      this.isLoggedIn = loggedIn;
      if (loggedIn) {
        this.checkAdminStatus();
      }
    });

    this.authService.currentUser$.subscribe(user => {
      if (user) {
        this.checkAdminStatus();
      }
    });

    this.actualizarTitulo();
  }

  private checkAdminStatus(): void {
    this.isAdmin = this.authService.isAdmin();
  }

  toggleAdminMenu(): void {
    this.isAdminMenuOpen = !this.isAdminMenuOpen;
  }

  closeAdminMenu(): void {
    this.isAdminMenuOpen = false;
  }

  private actualizarTitulo(): void {
    const rutaActual = this.router.url;
    
    const titulos: { [key: string]: string } = {
      '/desafios': 'Desafíos',
      '/desafios/crear': 'Crear Desafío',
      '/rankings': 'Ranking Global',
      '/progresos': 'Mi Progreso',
      '/auth/login': 'Iniciar Sesión',
      '/auth/registro': 'Registrarse',
      '/admin/usuarios': 'Gestión de Usuarios',
      '/admin/desafios': 'Gestión de Desafíos'
    };

    if (rutaActual.startsWith('/desafios/') && !rutaActual.includes('/crear')) {
      this.tituloPagina = 'Detalle del Desafío';
    } 
    else if (rutaActual.startsWith('/rankings')) {
      this.tituloPagina = 'Ranking Global';
    }
    else if (rutaActual.startsWith('/admin/usuarios')) {
      this.tituloPagina = 'Gestión de Usuarios';
    }
    else if (rutaActual.startsWith('/admin/desafios')) {
      this.tituloPagina = 'Gestión de Desafíos';
    }
    else {
      this.tituloPagina = titulos[rutaActual] || 'SportifyMe';
    }
  }

  irALogin(): void {
    this.router.navigate(['/auth/login']);
  }

  cerrarSesion(): void {
    this.authService.logout();
    this.router.navigate(['/auth/login']);
  }


  irAGestionUsuarios(): void {
    this.router.navigate(['/admin/usuarios']);
    this.closeAdminMenu();
  }

  irAGestionDesafios(): void {
    this.router.navigate(['/admin/desafios']);
    this.closeAdminMenu();
  }
}