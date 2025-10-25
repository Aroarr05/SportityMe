import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Usuario } from '../../../../../shared/models';

@Component({
  selector: 'app-lista-usuarios',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './lista-usuarios.component.html'
})
export class ListaUsuariosComponent {
  @Input() usuarios: Usuario[] = [];
  @Input() cargando = false;
  @Output() editar = new EventEmitter<Usuario>();
  @Output() ver = new EventEmitter<Usuario>();
  @Output() eliminar = new EventEmitter<number>();

  roles = [
    { id: 1, nombre: 'ADMIN' },
    { id: 2, nombre: 'USUARIO' }
  ];

  getRolNombre(rolId: number): string {
    const rol = this.roles.find(r => r.id === rolId);
    return rol ? rol.nombre : 'Desconocido';
  }

  getEstadoBadgeClass(activo: boolean): string {
    return activo 
      ? 'bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium'
      : 'bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs font-medium';
  }

  getEstadoTexto(activo: boolean): string {
    return activo ? 'ACTIVO' : 'INACTIVO';
  }

  formatearFecha(fecha: string): string {
    return new Date(fecha).toLocaleDateString('es-ES');
  }

  onEliminarUsuario(id: number, nombre: string): void {
    if (confirm(`¿Estás seguro de que quieres eliminar al usuario "${nombre}"?`)) {
      this.eliminar.emit(id);
    }
  }
}