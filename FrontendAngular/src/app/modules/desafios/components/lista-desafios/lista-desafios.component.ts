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
  desafios: Desafio[] = [];
  loading = true;
  error: string | null = null;

  constructor(private desafiosService: DesafiosService) { }

  ngOnInit(): void {
    this.cargarDesafios();
  }

  cargarDesafios(): void {
    this.loading = true;
    this.error = null;
    
    this.desafiosService.obtenerDesafios().subscribe({
      next: (desafios) => {
        console.log('Desafíos cargados desde la BD:', desafios);
        this.desafios = this.normalizarDatosDesafios(desafios);
        this.loading = false;
      },
      error: (err) => {
        console.error('Error al cargar desafíos:', err);
        this.error = 'Error al cargar los desafíos. Por favor, inténtalo de nuevo más tarde.';
        this.loading = false;
      }
    });
  }

  private normalizarDatosDesafios(datos: any[]): Desafio[] {
    if (!datos || !Array.isArray(datos)) {
      return [];
    }

    return datos.map(item => {
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
        es_publico: item.esPublico !== undefined ? item.esPublico : 
                   item.es_publico !== undefined ? item.es_publico : true,
        dificultad: item.dificultad || 'INTERMEDIO',
        max_participantes: item.maxParticipantes || item.max_participantes || 0,
        imagen_url: item.imagenUrl || item.imagen_url || '',
        estado: item.estado || 'ACTIVO'
      };
    });
  }

  unirseADesafio(desafioId: number): void {
    this.desafiosService.unirseADesafio(desafioId).subscribe({
      next: (response) => {
        console.log('Unido al desafío:', response);
        alert('¡Te has unido al desafío exitosamente!');
        this.cargarDesafios();
      },
      error: (err) => {
        console.error('Error al unirse al desafío:', err);
        alert('Error: ' + err.message);
      }
    });
  }

  eliminarDesafio(desafioId: number): void {
    if (confirm('¿Estás seguro de que quieres eliminar este desafío?')) {
      this.desafiosService.eliminarDesafio(desafioId).subscribe({
        next: () => {
          console.log('Desafío eliminado');
      
          this.desafios = this.desafios.filter(d => d.id !== desafioId);
          alert('Desafío eliminado exitosamente');
        },
        error: (err) => {
          console.error('Error al eliminar desafío:', err);
          alert('Error: ' + err.message);
        }
      });
    }
  }

  reintentar(): void {
    this.cargarDesafios();
  }

  formatearFecha(fecha: string): string {
    return new Date(fecha).toLocaleDateString('es-ES');
  }
}