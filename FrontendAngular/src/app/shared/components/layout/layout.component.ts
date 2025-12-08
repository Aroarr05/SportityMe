import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
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
  
  currentUser: any = null;

  constructor(
    private router: Router,
    private authService: AuthService,
    private cdRef: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        this.actualizarTitulo();
      });

    this.authService.currentUser$.subscribe(user => {
      if (user) {
        this.currentUser = user;
        this.isLoggedIn = true;
        this.isAdmin = this.authService.isAdmin();
      } else {
        this.currentUser = null;
        this.isLoggedIn = false;
        this.isAdmin = false;
      }
      
      this.cdRef.detectChanges();
    });

    this.actualizarTitulo();
  }

  getUserInitials(): string {
    if (!this.currentUser?.nombre) return 'U';
    
    const names = this.currentUser.nombre.split(' ');
    if (names.length === 1) {
      return names[0].charAt(0).toUpperCase();
    } else {
      return (names[0].charAt(0) + names[names.length - 1].charAt(0)).toUpperCase();
    }
  }

  hasAvatar(): boolean {
    return !!(this.currentUser?.avatar_url);
  }

  getAvatarUrl(): string {
    if (this.currentUser?.avatar_url) {
      const url = this.currentUser.avatar_url;
      
      if (url.startsWith('http')) {
        return url;
      } else if (url.startsWith('/assets/avatars/')) {
        const nombreArchivo = url.split('/').pop();
        if (nombreArchivo) {
          const base64Data = localStorage.getItem(`avatar_${nombreArchivo}`);
          if (base64Data) {
            return `data:image/jpeg;base64,${base64Data}`;
          }
        }
      }
      
      return url;
    }
    
    return '';
  }

  handleImageError(event: any): void {
    event.target.style.display = 'none';
    const avatarContainer = event.target.parentElement;
    const initialsElement = avatarContainer.querySelector('.avatar-initials');
    if (initialsElement) {
      initialsElement.style.display = 'flex';
    }
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
      '/perfil': 'Mi Perfil', 
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
    else if (rutaActual.startsWith('/perfil')) {
      this.tituloPagina = 'Mi Perfil'; 
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
  
  irAPerfil(): void {
    this.router.navigate(['/perfil']);
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