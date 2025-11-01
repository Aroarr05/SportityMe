import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { DesafiosService } from '../../services/desafios.service';
import { AuthService } from '../../../../auth/services/auth.service';
import { Desafio } from '../../../../shared/models';
import { LoadingSpinnerComponent } from '../../../../shared/components/loading-spinner/loading-spinner.component';
import { ErrorAlertComponent } from '../../../../shared/components/error-alert/error-alert.component';

@Component({
  selector: 'app-detalle-desafio',
  templateUrl: './detalle-desafio.component.html',
  styleUrls: ['./detalle-desafio.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    LoadingSpinnerComponent,
    ErrorAlertComponent
  ]
})
export class DetalleDesafioComponent implements OnInit {
  desafio!: Desafio & { progreso: number; dias_restantes: number; participantes_count: number };
  loading = true;
  error: string | null = null;
  participando = false;
  usuarioAutenticado = false;
  usuarioActual: any = null;
  uniendo = false; 

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private desafiosService: DesafiosService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.verificarAutenticacion();
    this.cargarDesafio();
  }

  private verificarAutenticacion(): void {
    this.usuarioAutenticado = this.authService.isLoggedIn();
    this.usuarioActual = this.authService.getCurrentUser();
    
    this.authService.isLoggedIn$.subscribe(isLoggedIn => {
      this.usuarioAutenticado = isLoggedIn;
    });
    
    this.authService.currentUser$.subscribe(user => {
      this.usuarioActual = user;
    });
  }

  cargarDesafio(): void {
    this.loading = true;
    this.error = null;
    const desafioId = this.route.snapshot.paramMap.get('id');

    if (!desafioId) {
      this.error = 'ID del desafío no válido';
      this.loading = false;
      return;
    }

    this.desafiosService.obtenerDesafioPorId(+desafioId).subscribe({
      next: (desafio) => {
        this.desafio = this.calcularDatosExtras(desafio);
        this.verificarParticipacion();
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Error al cargar el desafío. Por favor, inténtalo de nuevo más tarde.';
        this.loading = false;
      }
    });
  }

  private verificarParticipacion(): void {
    if (!this.usuarioAutenticado || !this.usuarioActual) {
      this.participando = false;
      return;
    }

    this.desafiosService.verificarParticipacion(this.desafio.id).subscribe({
      next: (participa) => {
        this.participando = participa;
      },
      error: (err) => {
        this.participando = false;
      }
    });
  }

  private calcularDatosExtras(desafio: Desafio): Desafio & { progreso: number; dias_restantes: number; participantes_count: number } {
    if (!desafio.fecha_inicio || !desafio.fecha_fin) {
      const fechaInicioDefault = desafio.fecha_creacion || new Date().toISOString();
      const fechaFinDefault = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();
      
      return { 
        ...desafio, 
        fecha_inicio: desafio.fecha_inicio || fechaInicioDefault,
        fecha_fin: desafio.fecha_fin || fechaFinDefault,
        progreso: 0, 
        dias_restantes: 30, 
        participantes_count: 0 
      };
    }

    try {
      const fechaInicio = new Date(desafio.fecha_inicio);
      const fechaFin = new Date(desafio.fecha_fin);
      const hoy = new Date();

      if (isNaN(fechaInicio.getTime()) || isNaN(fechaFin.getTime())) {
        return { 
          ...desafio, 
          progreso: 0, 
          dias_restantes: 0, 
          participantes_count: 0 
        };
      }

      const totalDias = Math.ceil((fechaFin.getTime() - fechaInicio.getTime()) / (1000 * 60 * 60 * 24));
      const diasTranscurridos = Math.max(0, Math.min(totalDias, Math.ceil((hoy.getTime() - fechaInicio.getTime()) / (1000 * 60 * 60 * 24))));
      const progreso = totalDias > 0 ? Math.round((diasTranscurridos / totalDias) * 100) : 0;
      const dias_restantes = Math.max(0, totalDias - diasTranscurridos);

      return { 
        ...desafio, 
        progreso, 
        dias_restantes, 
        participantes_count: 0
      };
    } catch (error) {
      return { 
        ...desafio, 
        progreso: 0, 
        dias_restantes: 0, 
        participantes_count: 0 
      };
    }
  }

  unirseADesafio(): void {
    if (!this.usuarioAutenticado) {
      this.redirigirALogin();
      return;
    }

    this.uniendo = true;

    this.desafiosService.unirseADesafio(this.desafio.id).subscribe({
      next: (response) => {
        this.participando = true;
        this.uniendo = false;
        this.desafio.participantes_count++;
        

        setTimeout(() => {
          alert('¡Te has unido al desafío exitosamente!');
        }, 500);
        
        this.verificarParticipacion();
      },
      error: (err) => {
        this.uniendo = false;
        let mensajeError = 'Error al unirse al desafío';
        
        if (err.status === 403) {
          mensajeError = 'No tienes permisos para unirte a este desafío. Tu sesión puede haber expirado. Por favor, inicia sesión nuevamente.';
          this.authService.logout();
          this.redirigirALogin();
          return;
        } else if (err.status === 400) {
          mensajeError = err.error?.message || 'No puedes unirte a este desafío';
        } else if (err.status === 404) {
          mensajeError = 'El desafío no existe o no está disponible';
        } else if (err.status === 0) {
          mensajeError = 'Error de conexión. Verifica tu conexión a internet.';
        }
        
        alert(mensajeError);
      }
    });
  }

  abandonarDesafio(): void {
    if (!confirm('¿Estás seguro de que quieres abandonar este desafío?')) return;

    this.desafiosService.abandonarDesafio(this.desafio.id).subscribe({
      next: () => {
        this.participando = false;
        this.desafio.participantes_count = Math.max(0, this.desafio.participantes_count - 1);
        alert('Has abandonado el desafío');
      },
      error: (err) => {
        alert('Error al abandonar el desafío: ' + err.message);
      }
    });
  }

  redirigirALogin(): void {
    this.router.navigate(['/auth/login'], { 
      queryParams: { returnUrl: this.router.url } 
    });
  }

  getIconoClase(tipo: string): string {
    switch (tipo) {
      case 'correr': return 'bg-orange-100 text-orange-600';
      case 'ciclismo': return 'bg-yellow-100 text-yellow-600';
      case 'natacion': return 'bg-blue-100 text-blue-600';
      case 'gimnasio': return 'bg-red-100 text-red-600';
      case 'senderismo': return 'bg-green-100 text-green-600';
      case 'yoga': return 'bg-purple-100 text-purple-600';
      default: return 'bg-gray-100 text-gray-500';
    }
  }

  getDificultadClase(dificultad: string): string {
    if (!dificultad) return 'bg-gray-100 text-gray-800';
    
    switch (dificultad.toUpperCase()) {
      case 'FÁCIL':
      case 'FACIL':
      case 'PRINCIPIANTE':
        return 'bg-green-100 text-green-800';
      case 'INTERMEDIO':
      case 'MEDIO':
        return 'bg-yellow-100 text-yellow-800';
      case 'DIFÍCIL':
      case 'DIFICIL':
      case 'AVANZADO':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }

  calcularDuracionDias(): number {
    if (!this.desafio || !this.desafio.fecha_inicio || !this.desafio.fecha_fin) {
      return 0;
    }
    
    try {
      const fechaInicio = new Date(this.desafio.fecha_inicio);
      const fechaFin = new Date(this.desafio.fecha_fin);
      
      if (isNaN(fechaInicio.getTime()) || isNaN(fechaFin.getTime())) {
        return 0;
      }
      
      const diferenciaMs = fechaFin.getTime() - fechaInicio.getTime();
      const dias = Math.ceil(diferenciaMs / (1000 * 60 * 60 * 24));
      
      return Math.max(1, dias);
    } catch (error) {
      return 0;
    }
  }

  formatearFechaCorta(fecha: string): string {
    if (!fecha) return 'No disponible';
    
    try {
      const fechaObj = new Date(fecha);
      if (isNaN(fechaObj.getTime())) {
        return 'Fecha inválida';
      }
      return fechaObj.toLocaleDateString('es-ES', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    } catch (error) {
      return 'Fecha inválida';
    }
  }

  reintentar(): void {
    this.cargarDesafio();
  }
}