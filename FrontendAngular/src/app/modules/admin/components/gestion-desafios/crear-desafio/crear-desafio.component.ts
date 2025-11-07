import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminService } from '../../../services/admin.service';
import { CrearDesafioDto,TipoActividad } from '../../../../../shared/models';

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

  constructor(private adminService: AdminService) {}

  guardar(): void {
    if (!this.validarDesafio()) {
      return;
    }

    this.adminService.crearDesafio(this.desafio).subscribe({
      next: () => {
        this.creado.emit();
      },
      error: (error) => {
        console.error('Error creando desafío:', error);
        alert('Error al crear el desafío');
      }
    });
  }

  private validarDesafio(): boolean {
    if (!this.desafio.titulo?.trim()) {
      alert('El título es requerido');
      return false;
    }
    if (!this.desafio.descripcion?.trim()) {
      alert('La descripción es requerida');
      return false;
    }
    if ((this.desafio.objetivo ?? 0) <= 0) {
      alert('El objetivo debe ser mayor a 0');
      return false;
    }
    return true;
  }
}