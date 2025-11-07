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
  @Output() actualizado = new EventEmitter<void>();
  @Output() cancelar = new EventEmitter<void>();

  desafioEditado: Partial<CrearDesafioDto> = {};
  estadoDesafio: string = 'ACTIVO'; 
  
  TipoActividad = TipoActividad;
  tiposActividad = Object.values(TipoActividad);
  dificultades = ['FACIL', 'MEDIO', 'DIFICIL'];
  estados = ['ACTIVO', 'INACTIVO'];

  constructor(private adminService: AdminService) {}

  ngOnInit(): void {
    this.cargarDatosDesafio();
  }

  cargarDatosDesafio(): void {
    this.desafioEditado = { 
      titulo: this.desafio.titulo,
      descripcion: this.desafio.descripcion,
      tipo_actividad: this.desafio.tipo_actividad,
      objetivo: this.desafio.objetivo ?? 1,
      unidad_objetivo: this.desafio.unidad_objetivo,
      fecha_inicio: this.desafio.fecha_inicio,
      fecha_fin: this.desafio.fecha_fin,
      es_publico: this.desafio.es_publico,
      dificultad: this.desafio.dificultad,
      max_participantes: this.desafio.max_participantes ?? 100,
      icono: this.desafio.icono
    };
    this.estadoDesafio = this.desafio.estado || 'ACTIVO'; 
  }

  guardar(): void {
    if (!this.validarDesafio()) {
      return;
    }

    const desafioData = {
      titulo: this.desafioEditado.titulo ?? '',
      descripcion: this.desafioEditado.descripcion ?? '',
      tipo_actividad: this.desafioEditado.tipo_actividad ?? TipoActividad.CORRER,
      objetivo: this.desafioEditado.objetivo ?? 1,
      unidad_objetivo: this.desafioEditado.unidad_objetivo ?? 'km',
      fecha_inicio: this.desafioEditado.fecha_inicio ?? new Date().toISOString().split('T')[0],
      fecha_fin: this.desafioEditado.fecha_fin ?? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      es_publico: this.desafioEditado.es_publico ?? true,
      dificultad: this.desafioEditado.dificultad ?? 'MEDIO',
      max_participantes: this.desafioEditado.max_participantes ?? 100,
      icono: this.desafioEditado.icono,
      estado: this.estadoDesafio 
    };

    this.adminService.actualizarDesafio(this.desafio.id, desafioData).subscribe({
      next: () => {
        this.actualizado.emit();
      },
      error: (error) => {
        console.error('Error actualizando desafío:', error);
        alert('Error al actualizar el desafío');
      }
    });
  }

  private validarDesafio(): boolean {
    if (!this.desafioEditado.titulo?.trim()) {
      alert('El título es requerido');
      return false;
    }
    if (!this.desafioEditado.descripcion?.trim()) {
      alert('La descripción es requerida');
      return false;
    }
    if ((this.desafioEditado.objetivo ?? 0) <= 0) {
      alert('El objetivo debe ser mayor a 0');
      return false;
    }
    return true;
  }
}