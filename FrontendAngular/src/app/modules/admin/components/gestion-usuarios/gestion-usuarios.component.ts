import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminService } from '../../services/admin.service';
import { AuthService } from '../../../../auth/services/auth.service';
import { Usuario } from '../../../../shared/models';

@Component({
  selector: 'app-gestion-usuarios',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './gestion-usuarios.component.html'
})
export class GestionUsuariosComponent implements OnInit {
  usuarios: Usuario[] = [];
  usuarioEditando: Partial<Usuario> = {};
  mostrarModal = false;
  esEdicion = false;
  cargando = true;
  guardando = false;
  mensajeError = '';

  roles = [
    { id: 1, nombre: 'ADMIN' },
    { id: 2, nombre: 'USUARIO' }
  ];

  estados = [
    { valor: true, texto: 'Activo' },
    { valor: false, texto: 'Inactivo' }
  ];

  generos = [
    { valor: 'MASCULINO', texto: 'Masculino' },
    { valor: 'FEMENINO', texto: 'Femenino' },
    { valor: 'OTRO', texto: 'Otro' },
    { valor: 'NO_ESPECIFICADO', texto: 'No especificado' }
  ];

  constructor(
    private adminService: AdminService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.cargarUsuarios();
  }

  cargarUsuarios(): void {
    this.cargando = true;
    this.mensajeError = '';
    
    this.adminService.getUsuarios().subscribe({
      next: (usuarios) => {
        this.usuarios = usuarios;
        this.cargando = false;
      },
      error: (error) => {
        console.error('Error cargando usuarios:', error);
        this.mensajeError = 'Error al cargar los usuarios';
        this.cargando = false;
      }
    });
  }

  abrirCrearUsuario(): void {
    this.usuarioEditando = {
      rol_id: 2,
      activo: true
    };
    this.esEdicion = false;
    this.mostrarModal = true;
    this.mensajeError = '';
  }

  abrirEditarUsuario(usuario: Usuario): void {
    this.usuarioEditando = { ...usuario };
    this.esEdicion = true;
    this.mostrarModal = true;
    this.mensajeError = '';
  }

  guardarUsuario(): void {
    if (!this.validarFormulario()) {
      return;
    }

    this.guardando = true;
    this.mensajeError = '';

    if (this.esEdicion) {
      this.adminService.actualizarUsuario(this.usuarioEditando.id!, this.usuarioEditando).subscribe({
        next: () => {
          this.cargarUsuarios();
          this.cerrarModal();
          this.guardando = false;
        },
        error: (error) => {
          console.error('Error actualizando usuario:', error);
          this.mensajeError = 'Error al actualizar el usuario';
          this.guardando = false;
        }
      });
    } else {
      this.adminService.crearUsuario(this.usuarioEditando).subscribe({
        next: () => {
          this.cargarUsuarios();
          this.cerrarModal();
          this.guardando = false;
        },
        error: (error) => {
          console.error('Error creando usuario:', error);
          this.mensajeError = 'Error al crear el usuario';
          this.guardando = false;
        }
      });
    }
  }

  eliminarUsuario(id: number, nombre: string): void {
    if (confirm(`¿Estás seguro de que quieres eliminar al usuario "${nombre}"?`)) {
      this.adminService.eliminarUsuario(id).subscribe({
        next: () => {
          this.cargarUsuarios();
        },
        error: (error) => {
          console.error('Error eliminando usuario:', error);
          this.mensajeError = 'Error al eliminar el usuario';
        }
      });
    }
  }

  cerrarModal(): void {
    this.mostrarModal = false;
    this.usuarioEditando = {};
    this.mensajeError = '';
    this.guardando = false;
  }

  private validarFormulario(): boolean {
    if (!this.usuarioEditando.nombre?.trim()) {
      this.mensajeError = 'El nombre es requerido';
      return false;
    }

    if (!this.usuarioEditando.email?.trim()) {
      this.mensajeError = 'El email es requerido';
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.usuarioEditando.email)) {
      this.mensajeError = 'El formato del email no es válido';
      return false;
    }

    if (!this.esEdicion && !this.usuarioEditando.contraseña) {
      this.mensajeError = 'La contraseña es requerida para nuevos usuarios';
      return false;
    }

    return true;
  }

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
}