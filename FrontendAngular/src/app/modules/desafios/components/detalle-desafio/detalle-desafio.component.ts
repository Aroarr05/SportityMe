import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { DesafiosService } from '../../services/desafios.service';
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
  desafio!: Desafio & { progreso: number; dias_restantes: number };
  loading = true;
  error: string | null = null;
  participando = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private desafiosService: DesafiosService
  ) {}

  ngOnInit(): void {
    this.cargarDesafio();
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
        console.error('Error:', err);
        this.error = 'Error al cargar el desafío. Por favor, inténtalo de nuevo más tarde.';
        this.loading = false;
      }
    });
  }

  private verificarParticipacion(): void {
    this.participando = false;
  }

  private calcularDatosExtras(desafio: Desafio): Desafio & { progreso: number; dias_restantes: number } {
    const fechaInicio = new Date(desafio.fecha_inicio);
    const fechaFin = new Date(desafio.fecha_fin);
    const hoy = new Date();

    const totalDias = Math.ceil((fechaFin.getTime() - fechaInicio.getTime()) / (1000 * 60 * 60 * 24));
    const diasTranscurridos = Math.max(0, Math.min(totalDias, Math.ceil((hoy.getTime() - fechaInicio.getTime()) / (1000 * 60 * 60 * 24))));
    const progreso = totalDias > 0 ? Math.round((diasTranscurridos / totalDias) * 100) : 0;
    const dias_restantes = Math.max(0, totalDias - diasTranscurridos);

    return { ...desafio, progreso, dias_restantes };
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
    switch (dificultad?.toUpperCase()) {
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

  unirseADesafio(): void {
    this.desafiosService.unirseADesafio(this.desafio.id).subscribe({
      next: () => {
        this.participando = true;
        alert('¡Te has unido al desafío exitosamente!');
      },
      error: (err) => {
        alert('Error: ' + err.message);
      }
    });
  }

  abandonarDesafio(): void {
    if (!confirm('¿Estás seguro de que quieres abandonar este desafío?')) return;

    this.desafiosService.abandonarDesafio(this.desafio.id).subscribe({
      next: () => {
        this.participando = false;
        alert('Has abandonado el desafío');
      },
      error: (err) => {
        alert('Error: ' + err.message);
      }
    });
  }

  calcularDuracionDias(): number {
    if (!this.desafio) return 0;
    
    const fechaInicio = new Date(this.desafio.fecha_inicio);
    const fechaFin = new Date(this.desafio.fecha_fin);
    const diferenciaMs = fechaFin.getTime() - fechaInicio.getTime();
    const dias = Math.ceil(diferenciaMs / (1000 * 60 * 60 * 24));
    
    return dias;
  }

  eliminarDesafio(): void {
    if (!confirm('¿Estás seguro de que quieres eliminar este desafío?')) return;

    this.desafiosService.eliminarDesafio(this.desafio.id).subscribe({
      next: () => {
        alert('Desafío eliminado exitosamente');
        this.router.navigate(['/desafios']);
      },
      error: (err) => {
        alert('Error: ' + err.message);
      }
    });
  }

  formatearFecha(fecha: string): string {
    return new Date(fecha).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  formatearFechaCorta(fecha: string): string {
    return new Date(fecha).toLocaleDateString('es-ES');
  }

  calcularTiempoRestante(): string {
    if (this.desafio.dias_restantes === 0) {
      return 'Finaliza hoy';
    } else if (this.desafio.dias_restantes === 1) {
      return '1 día restante';
    } else {
      return `${this.desafio.dias_restantes} días restantes`;
    }
  }

  reintentar(): void {
    this.cargarDesafio();
  }
}