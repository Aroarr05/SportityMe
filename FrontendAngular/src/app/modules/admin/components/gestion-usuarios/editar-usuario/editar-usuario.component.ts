import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminService } from '../../../services/admin.service';
import { Usuario } from '../../../../../shared/models';

@Component({
  selector: 'app-editar-usuario',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './editar-usuario.component.html'
})

export class EditarUsuarioComponent implements OnInit {
  @Input() usuario!: Usuario;
  @Output() actualizado = new EventEmitter<void>();
  @Output() cancelar = new EventEmitter<void>();

  usuarioEditado: Partial<Usuario> = {};
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

  ngOnInit(): void {
    this.cargarDatosUsuario();
  }

  cargarDatosUsuario(): void {
    this.usuarioEditado = { ...this.usuario };
    delete this.usuarioEditado.contraseña;
  }

  guardar(): void {
    if (!this.validarFormulario()) {
      return;
    }

    this.guardando = true;
    this.mensajeError = '';

    this.adminService.actualizarUsuario(this.usuario.id, this.usuarioEditado).subscribe({
      next: () => {
        this.actualizado.emit();
        this.guardando = false;
      },
      error: (error) => {
        console.error('Error actualizando usuario:', error);
        this.mensajeError = 'Error al actualizar el usuario';
        this.guardando = false;
      }
    });
  }

  private validarFormulario(): boolean {
    if (!this.usuarioEditado.nombre?.trim()) {
      this.mensajeError = 'El nombre es requerido';
      return false;
    }

    if (!this.usuarioEditado.email?.trim()) {
      this.mensajeError = 'El email es requerido';
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.usuarioEditado.email)) {
      this.mensajeError = 'El formato del email no es válido';
      return false;
    }

    return true;
  }
}