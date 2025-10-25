import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Usuario } from '../../../../../shared/models';
@Component({
  selector: 'app-detalle-usuario',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './detalle-usuario.component.html'
})
export class DetalleUsuarioComponent {
  @Input() usuario!: Usuario;
  @Output() editar = new EventEmitter<void>();

  roles = [
    { id: 1, nombre: 'ADMIN' },
    { id: 2, nombre: 'USUARIO' }
  ];

  getRolNombre(rolId: number): string {
    const rol = this.roles.find(r => r.id === rolId);
    return rol ? rol.nombre : 'Desconocido';
  }

  getEstadoBadgeClass(): string {
    return this.usuario.activo 
      ? 'bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium'
      : 'bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-medium';
  }

  getEstadoTexto(): string {
    return this.usuario.activo ? 'ACTIVO' : 'INACTIVO';
  }

  formatearFecha(fecha: string): string {
    return new Date(fecha).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  getGeneroTexto(): string {
    switch (this.usuario.genero) {
      case 'MASCULINO': return 'Masculino';
      case 'FEMENINO': return 'Femenino';
      case 'OTRO': return 'Otro';
      case 'NO_ESPECIFICADO': return 'No especificado';
      default: return 'No especificado';
    }
  }
}