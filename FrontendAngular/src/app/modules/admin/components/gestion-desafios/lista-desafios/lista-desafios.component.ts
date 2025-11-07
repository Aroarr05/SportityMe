import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Desafio, TipoActividad } from '../../../../../shared/models';

@Component({
  selector: 'app-lista-desafios',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './lista-desafios.component.html'
})

export class ListaDesafiosComponent {
  @Input() desafios: Desafio[] = [];
  @Input() cargando = false;
  @Output() editar = new EventEmitter<Desafio>();
  @Output() ver = new EventEmitter<Desafio>();
  @Output() eliminar = new EventEmitter<number>();

  TipoActividad = TipoActividad;

  getEstadoBadgeClass(estado?: string): string {
    const estadoValor = estado ?? 'ACTIVO';
    switch (estadoValor) {
      case 'ACTIVO': return 'bg-green-100 text-green-800';
      case 'INACTIVO': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  }

  getTipoBadgeClass(tipo?: string): string {
    const tipoValor = tipo ?? TipoActividad.OTROS;
    switch (tipoValor) {
      case TipoActividad.CORRER: return 'bg-blue-100 text-blue-800';
      case TipoActividad.NATACION: return 'bg-cyan-100 text-cyan-800';
      case TipoActividad.CICLISMO: return 'bg-orange-100 text-orange-800';
      case TipoActividad.GIMNASIO: return 'bg-purple-100 text-purple-800';
      case TipoActividad.OTROS: return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  }

  getDificultadBadgeClass(dificultad?: string): string {
    const dificultadValor = dificultad ?? 'MEDIO';
    switch (dificultadValor) {
      case 'FACIL': return 'bg-green-100 text-green-800';
      case 'MEDIO': return 'bg-yellow-100 text-yellow-800';
      case 'DIFICIL': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  }

  onEliminarDesafio(id: number): void {
    if (confirm('¿Estás seguro de que quieres eliminar este desafío?')) {
      this.eliminar.emit(id);
    }
  }
}