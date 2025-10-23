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
        console.log('Datos completos del desafío:', desafio);
        console.log('Fecha inicio:', desafio.fecha_inicio);
        console.log('Fecha fin:', desafio.fecha_fin);
        
        this.desafio = this.calcularDatosExtras(desafio);
        this.verificarParticipacion();
        this.loading = false;
      },
      error: (err) => {
        console.error('Error completo:', err);
        this.error = 'Error al cargar el desafío. Por favor, inténtalo de nuevo más tarde.';
        this.loading = false;
      }
    });
  }

  private verificarParticipacion(): void {
    this.participando = false;
  }

  private calcularDatosExtras(desafio: Desafio): Desafio & { progreso: number; dias_restantes: number } {
    if (!desafio.fecha_inicio || !desafio.fecha_fin) {
      console.warn('Fechas no disponibles:', {
        fecha_inicio: desafio.fecha_inicio,
        fecha_fin: desafio.fecha_fin
      });
      return { ...desafio, progreso: 0, dias_restantes: 0 };
    }

    try {
      const fechaInicio = new Date(desafio.fecha_inicio);
      const fechaFin = new Date(desafio.fecha_fin);
      const hoy = new Date();

      if (isNaN(fechaInicio.getTime()) || isNaN(fechaFin.getTime())) {
        console.error('Fechas inválidas después de conversion:', {
          fecha_inicio: desafio.fecha_inicio,
          fecha_fin: desafio.fecha_fin
        });
        return { ...desafio, progreso: 0, dias_restantes: 0 };
      }

      const totalDias = Math.ceil((fechaFin.getTime() - fechaInicio.getTime()) / (1000 * 60 * 60 * 24));
      const diasTranscurridos = Math.max(0, Math.min(totalDias, Math.ceil((hoy.getTime() - fechaInicio.getTime()) / (1000 * 60 * 60 * 24))));
      const progreso = totalDias > 0 ? Math.round((diasTranscurridos / totalDias) * 100) : 0;
      const dias_restantes = Math.max(0, totalDias - diasTranscurridos);

      console.log('Cálculos:', {
        totalDias,
        diasTranscurridos,
        progreso,
        dias_restantes
      });

      return { ...desafio, progreso, dias_restantes };
    } catch (error) {
      console.error('Error en calcularDatosExtras:', error);
      return { ...desafio, progreso: 0, dias_restantes: 0 };
    }
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
      
      return dias;
    } catch (error) {
      console.error('Error calculando duración:', error);
      return 0;
    }
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
    if (!fecha) return 'No disponible';
    
    try {
      const fechaObj = new Date(fecha);
      if (isNaN(fechaObj.getTime())) {
        return 'Fecha inválida';
      }
      return fechaObj.toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (error) {
      return 'Fecha inválida';
    }
  }

  formatearFechaCorta(fecha: string): string {
    if (!fecha) return 'No disponible';
    
    try {
      const fechaObj = new Date(fecha);
      if (isNaN(fechaObj.getTime())) {
        return 'Fecha inválida';
      }
      return fechaObj.toLocaleDateString('es-ES');
    } catch (error) {
      return 'Fecha inválida';
    }
  }

  calcularTiempoRestante(): string {
    if (!this.desafio) return 'No disponible';
    
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

  verDatosCompletos(): void {
    console.log('Datos completos del desafío:', this.desafio);
    alert('Revisa la consola para ver todos los datos del desafío');
  }
}