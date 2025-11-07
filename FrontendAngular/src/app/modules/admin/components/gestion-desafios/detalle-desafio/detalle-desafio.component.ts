import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Desafio, TipoActividad } from '../../../../../shared/models';

@Component({
  selector: 'app-detalle-desafio',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './detalle-desafio.component.html'
})

export class DetalleDesafioComponent {
  @Input() desafio!: Desafio;
  @Output() editar = new EventEmitter<void>();

  TipoActividad = TipoActividad;

  getEstadoBadgeClass(): string {
    const estado = this.desafio.estado ?? 'ACTIVO';
    switch (estado) {
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

  getDificultadBadgeClass(): string {
    const dificultad = this.desafio.dificultad ?? 'MEDIO';
    switch (dificultad) {
      case 'FACIL': return 'bg-green-100 text-green-800';
      case 'MEDIO': return 'bg-yellow-100 text-yellow-800';
      case 'DIFICIL': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  }


  getInfoParticipantes(): string {
    return `${this.desafio.max_participantes} participantes máximo`;
  }

  esDesafioActivo(): boolean {
    const fechaFin = new Date(this.desafio.fecha_fin);
    const hoy = new Date();
    return fechaFin >= hoy && this.desafio.estado !== 'INACTIVO';
  }

  formatearFecha(fecha: string): string {
    return new Date(fecha).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }
}