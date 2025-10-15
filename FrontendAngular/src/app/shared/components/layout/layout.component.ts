import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { AuthService } from '../../../auth/services/auth.service';
import { NavbarComponent } from '../navbar/navbar.component';
import { FooterComponent } from '../footer/footer.component';

@Component({
  standalone: true,
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss'],
  imports: [
    CommonModule, 
    RouterModule,
    NavbarComponent,
    FooterComponent 
  ]
})

export class LayoutComponent implements OnInit {
  tituloPagina = 'SportifyMe';

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

    this.actualizarTitulo();
  }

  private actualizarTitulo(): void {
    const rutaActual = this.router.url;
    
    const titulos: { [key: string]: string } = {
      '/desafios': 'Desafíos',
      '/desafios/crear': 'Crear Desafío',
      '/rankings': 'Ranking Global',
      '/progresos': 'Mi Progreso',
      '/auth/login': 'Iniciar Sesión',
      '/auth/registro': 'Registrarse'
    };

    if (rutaActual.startsWith('/desafios/') && !rutaActual.includes('/crear')) {
      this.tituloPagina = 'Detalle del Desafío';
    } 
    else if (rutaActual.startsWith('/rankings')) {
      this.tituloPagina = 'Ranking Global';
    }
    else {
      this.tituloPagina = titulos[rutaActual] || 'SportifyMe';
    }
  }
}