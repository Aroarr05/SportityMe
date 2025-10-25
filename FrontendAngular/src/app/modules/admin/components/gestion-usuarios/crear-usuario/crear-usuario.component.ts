import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminService } from '../../../services/admin.service';
import { Usuario } from '../../../../../shared/models';
@Component({
  selector: 'app-crear-usuario',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './crear-usuario.component.html'
})
export class CrearUsuarioComponent {
  @Output() creado = new EventEmitter<void>();
  @Output() cancelar = new EventEmitter<void>();

  usuario: Partial<Usuario> = {
    rol_id: 2,
    activo: true
  };

  guardando = false;
  mensajeError = '';

  roles = [
    { id: 1, nombre: 'ADMIN' },
    { id: 2, nombre: 'USUARIO' }
  ];

  generos = [
    { valor: 'MASCULINO', texto: 'Masculino' },
    { valor: 'FEMENINO', texto: 'Femenino' },
    { valor: 'OTRO', texto: 'Otro' },
    { valor: 'NO_ESPECIFICADO', texto: 'No especificado' }
  ];

  constructor(private adminService: AdminService) {}

  guardar(): void {
    if (!this.validarFormulario()) {
      return;
    }

    this.guardando = true;
    this.mensajeError = '';

    this.adminService.crearUsuario(this.usuario).subscribe({
      next: () => {
        this.creado.emit();
        this.guardando = false;
      },
      error: (error) => {
        console.error('Error creando usuario:', error);
        this.mensajeError = 'Error al crear el usuario';
        this.guardando = false;
      }
    });
  }

  private validarFormulario(): boolean {
    if (!this.usuario.nombre?.trim()) {
      this.mensajeError = 'El nombre es requerido';
      return false;
    }

    if (!this.usuario.email?.trim()) {
      this.mensajeError = 'El email es requerido';
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.usuario.email)) {
      this.mensajeError = 'El formato del email no es válido';
      return false;
    }

    if (!this.usuario.contraseña) {
      this.mensajeError = 'La contraseña es requerida';
      return false;
    }

    return true;
  }
}