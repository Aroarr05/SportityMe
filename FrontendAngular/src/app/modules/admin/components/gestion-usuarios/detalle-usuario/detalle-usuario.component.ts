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
  @Input() usuario!: any;
  @Output() editar = new EventEmitter<void>();

  getInitials(): string {
    if (!this.usuario?.nombre) return 'U';
    
    const names = this.usuario.nombre.split(' ');
    if (names.length === 1) {
      return names[0].charAt(0).toUpperCase();
    } else {
      return (names[0].charAt(0) + names[names.length - 1].charAt(0)).toUpperCase();
    }
  }

  handleImageError(event: any): void {
    event.target.style.display = 'none';
  }

  getRolNombre(): string {
    return this.usuario.rol || 'USUARIO';
  }

  getEstadoBadgeClass(): string {
    return true 
      ? 'bg-gradient-to-r from-green-100 to-green-50 text-green-800 border border-green-200'
      : 'bg-gradient-to-r from-red-100 to-red-50 text-red-800 border border-red-200';
  }

  getEstadoTexto(): string {
    return 'ACTIVO';
  }

  formatearFecha(fecha: any): string {
    if (!fecha) return 'No especificada';
    
    const fechaObj = new Date(fecha);
    if (isNaN(fechaObj.getTime())) {
      return 'Fecha inválida';
    }
    return fechaObj.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  getGeneroTexto(): string {
    if (!this.usuario.genero) return 'No especificado';
    
    const genero = this.usuario.genero.toLowerCase();
    switch (genero) {
      case 'masculino': return 'Masculino';
      case 'femenino': return 'Femenino';
      case 'otro': return 'Otro';
      case 'no_especificado': return 'No especificado';
      default: return 'No especificado';
    }
  }
}