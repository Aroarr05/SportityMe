import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminService } from '../../../services/admin.service';
import { CrearDesafioDto, TipoActividad } from '../../../../../shared/models';

@Component({
  selector: 'app-crear-desafio',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './crear-desafio.component.html'
})

export class CrearDesafioComponent {
  @Output() creado = new EventEmitter<void>();
  @Output() cancelar = new EventEmitter<void>();

  desafio: CrearDesafioDto = {
    titulo: '',
    descripcion: '',
    tipo_actividad: TipoActividad.CORRER,
    objetivo: 1,
    unidad_objetivo: 'km',
    fecha_inicio: new Date().toISOString().split('T')[0],
    fecha_fin: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    es_publico: true,
    dificultad: 'MEDIO',
    max_participantes: 100
  };

  TipoActividad = TipoActividad;
  tiposActividad = Object.values(TipoActividad);
  dificultades = ['FACIL', 'MEDIO', 'DIFICIL'];
  mensajeError = '';
  guardando = false;

  constructor(private adminService: AdminService) {}

  guardar(): void {
    if (!this.validarDesafio()) return;

    this.guardando = true;
    this.mensajeError = '';

    const desafioParaEnviar = {
      ...this.desafio,
      objetivo: Number(this.desafio.objetivo),
      max_participantes: Number(this.desafio.max_participantes),
      fecha_inicio: this.formatFecha(this.desafio.fecha_inicio),
      fecha_fin: this.formatFecha(this.desafio.fecha_fin),
      tipo_actividad: this.desafio.tipo_actividad,
      dificultad: this.desafio.dificultad
    };

    this.adminService.crearDesafio(desafioParaEnviar).subscribe({
      next: () => {
        this.creado.emit();
        this.guardando = false;
      },
      error: (error) => {
        this.mensajeError = 'Error al crear el desafío: ' + error.message;
        this.guardando = false;
      }
    });
  }

  private validarDesafio(): boolean {
    if (!this.desafio.titulo?.trim()) {
      this.mensajeError = 'El título es requerido';
      return false;
    }
    if (!this.desafio.descripcion?.trim()) {
      this.mensajeError = 'La descripción es requerida';
      return false;
    }
    if ((this.desafio.objetivo ?? 0) <= 0) {
      this.mensajeError = 'El objetivo debe ser mayor a 0';
      return false;
    }
    return true;
  }

  private formatFecha(fecha: string): string {
    if (!fecha) return fecha;

    if (fecha.length === 10) {
      return `${fecha}T00:00:00`;
    }

    return fecha;
  }
}
