import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DesafiosService } from '../../services/desafios.service';
import { Desafio } from '../../../../shared/models';
import { LoadingSpinnerComponent } from '../../../../shared/components/loading-spinner/loading-spinner.component';
import { ErrorAlertComponent } from '../../../../shared/components/error-alert/error-alert.component';

@Component({
  selector: 'app-lista-desafios',
  templateUrl: './lista-desafios.component.html',
  styleUrls: ['./lista-desafios.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    LoadingSpinnerComponent,
    ErrorAlertComponent
  ]
})
export class ListaDesafiosComponent implements OnInit {
  desafios: (Desafio & { progreso: number; dias_restantes: number })[] = [];
  loading = true;
  error: string | null = null;

  constructor(private desafiosService: DesafiosService) {}

  ngOnInit(): void {
    this.cargarDesafios();
  }

  cargarDesafios(): void {
    this.loading = true;
    this.error = null;

    this.desafiosService.obtenerDesafios().subscribe({
      next: (desafios) => {
        console.log('Datos recibidos:', desafios); // Para debug
        const normalizados = this.normalizarDatosDesafios(desafios);
        this.desafios = normalizados.map(d => this.calcularDatosExtras(d));
        this.loading = false;
      },
      error: (err) => {
        console.error('Error:', err);
        this.error = 'Error al cargar los desafíos. Por favor, inténtalo de nuevo más tarde.';
        this.loading = false;
      }
    });
  }

  private normalizarDatosDesafios(datos: any[]): Desafio[] {
    if (!datos || !Array.isArray(datos)) return [];

    return datos.map(item => {
      // Calcular icono si no viene del servidor
      const icono = item.icono || this.getIconoFromTipoActividad(
        item.tipoActividad || item.tipo_actividad
      );

      return {
        id: item.id || 0,
        titulo: item.titulo || 'Sin título',
        descripcion: item.descripcion || '',
        tipo_actividad: item.tipoActividad || item.tipo_actividad || 'otros',
        objetivo: item.objetivo || 0,
        unidad_objetivo: item.unidadObjetivo || item.unidad_objetivo || '',
        fecha_inicio: item.fechaInicio || item.fecha_inicio || new Date().toISOString(),
        fecha_fin: item.fechaFin || item.fecha_fin || new Date().toISOString(),
        creador_id: item.creadorId || item.creador_id || 0,
        es_publico: item.esPublico ?? item.es_publico ?? true,
        dificultad: item.dificultad || 'INTERMEDIO',
        max_participantes: item.maxParticipantes || item.max_participantes || 0,
        imagen_url: item.imagenUrl || item.imagen_url || '',
        estado: item.estado || 'ACTIVO',
        icono: icono
      };
    });
  }

  private getIconoFromTipoActividad(tipoActividad: string): string {
    const iconos: {[key: string]: string} = {
      'correr': 'fa-running',
      'ciclismo': 'fa-bicycle',
      'natacion': 'fa-swimmer',
      'gimnasio': 'fa-dumbbell',
      'otros': 'fa-star'
    };
    return iconos[tipoActividad] || 'fa-star';
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

  unirseADesafio(desafioId: number): void {
    this.desafiosService.unirseADesafio(desafioId).subscribe({
      next: () => {
        alert('¡Te has unido al desafío exitosamente!');
        this.cargarDesafios();
      },
      error: (err) => {
        alert('Error: ' + err.message);
      }
    });
  }

  eliminarDesafio(desafioId: number): void {
    if (!confirm('¿Estás seguro de que quieres eliminar este desafío?')) return;

    this.desafiosService.eliminarDesafio(desafioId).subscribe({
      next: () => {
        this.desafios = this.desafios.filter(d => d.id !== desafioId);
        alert('Desafío eliminado exitosamente');
      },
      error: (err) => {
        alert('Error: ' + err.message);
      }
    });
  }

  reintentar(): void {
    this.cargarDesafios();
  }

  formatearFecha(fecha: string): string {
    return new Date(fecha).toLocaleDateString('es-ES');
  }
}