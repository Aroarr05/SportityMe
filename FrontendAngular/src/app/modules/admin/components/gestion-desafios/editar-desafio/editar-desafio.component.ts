import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminService } from '../../../services/admin.service';
import { Desafio, CrearDesafioDto, TipoActividad } from '../../../../../shared/models';

@Component({
  selector: 'app-editar-desafio',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './editar-desafio.component.html'
})

export class EditarDesafioComponent implements OnInit {
  @Input() desafio!: Desafio;
  @Output() actualizado = new EventEmitter<Desafio>();
  @Output() cancelar = new EventEmitter<void>();

  desafioEditado: Partial<CrearDesafioDto> = {};
  estadoDesafio: string = 'ACTIVO';
  errors: any = {};
  errorMessage: string = '';

  TipoActividad = TipoActividad;
  tiposActividad = Object.values(TipoActividad);
  dificultades = ['FACIL', 'MEDIO', 'DIFICIL'];
  estados = ['ACTIVO', 'INACTIVO'];

  constructor(private adminService: AdminService) {}

  ngOnInit(): void {
    this.cargarDatosDesafio();
  }

  cargarDatosDesafio(): void {
    const fechaInicio = this.desafio.fecha_inicio ? 
      new Date(this.desafio.fecha_inicio).toISOString().split('T')[0] : '';
    
    const fechaFin = this.desafio.fecha_fin ? 
      new Date(this.desafio.fecha_fin).toISOString().split('T')[0] : '';

    this.desafioEditado = {
      titulo: this.desafio.titulo || '',
      descripcion: this.desafio.descripcion || '',
      tipo_actividad: this.desafio.tipo_actividad || TipoActividad.CORRER,
      objetivo: this.desafio.objetivo ?? 1,
      unidad_objetivo: this.desafio.unidad_objetivo || 'km',
      fecha_inicio: fechaInicio,
      fecha_fin: fechaFin,
      es_publico: this.desafio.es_publico ?? true,
      dificultad: this.desafio.dificultad || 'MEDIO',
      max_participantes: this.desafio.max_participantes ?? 100,
      icono: this.desafio.icono || ''
    };
    
    this.estadoDesafio = this.desafio.estado || 'ACTIVO';
  }

  guardar(): void {
    this.validarDesafio();
    if (this.hasErrors()) return;

    const desafioData = {
      titulo: this.desafioEditado.titulo || '',
      descripcion: this.desafioEditado.descripcion || '',
      tipo_actividad: this.desafioEditado.tipo_actividad || TipoActividad.CORRER,
      objetivo: this.desafioEditado.objetivo || 1,
      unidad_objetivo: this.desafioEditado.unidad_objetivo || 'km',
      fecha_inicio: this.desafioEditado.fecha_inicio ? 
        new Date(this.desafioEditado.fecha_inicio).toISOString() : new Date().toISOString(),
      fecha_fin: this.desafioEditado.fecha_fin ? 
        new Date(this.desafioEditado.fecha_fin).toISOString() : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      es_publico: this.desafioEditado.es_publico ?? true,
      dificultad: this.desafioEditado.dificultad || 'MEDIO',
      max_participantes: this.desafioEditado.max_participantes || 100,
      icono: this.desafioEditado.icono || '',
      estado: this.estadoDesafio
    };

    this.adminService.actualizarDesafio(this.desafio.id, desafioData).subscribe({
      next: (desafioActualizado) => {
        this.actualizado.emit(desafioActualizado);
      },
      error: (error) => {
        console.error('Error al actualizar:', error);
        this.errorMessage = 'Error al actualizar el desafío. Por favor, inténtalo de nuevo.';
      }
    });
  }

  private validarDesafio(): void {
    this.errors = {};

    if (!this.desafioEditado.titulo?.trim()) {
      this.errors.titulo = 'El título es requerido';
    }

    if (!this.desafioEditado.descripcion?.trim()) {
      this.errors.descripcion = 'La descripción es requerida';
    }

    if ((this.desafioEditado.objetivo ?? 0) <= 0) {
      this.errors.objetivo = 'El objetivo debe ser mayor a 0';
    }

    if (this.desafioEditado.fecha_inicio && this.desafioEditado.fecha_fin) {
      const inicio = new Date(this.desafioEditado.fecha_inicio);
      const fin = new Date(this.desafioEditado.fecha_fin);
      
      if (fin < inicio) {
        this.errors.fechas = 'La fecha de fin debe ser posterior a la fecha de inicio';
      }
    }
  }

  hasErrors(): boolean {
    return Object.keys(this.errors).length > 0;
  }

  getErrorMessages(): string[] {
    return Object.values(this.errors);
  }

  formatearFecha(fecha: string): string {
    if (!fecha) return 'Fecha no disponible';

    try {
      return new Date(fecha).toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch {
      return 'Fecha inválida';
    }
  }
}