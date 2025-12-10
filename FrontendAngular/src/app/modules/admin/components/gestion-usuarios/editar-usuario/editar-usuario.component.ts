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
  @Output() actualizado = new EventEmitter<Usuario>();
  @Output() cancelar = new EventEmitter<void>();

  usuarioEditado: Partial<Usuario> = {};
  guardando = false;
  mensajeError = '';
  nuevaContrasena: string = '';

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

  constructor(private adminService: AdminService) { }

  ngOnInit(): void {
    this.cargarDatosUsuario();
  }

  cargarDatosUsuario(): void {
    this.usuarioEditado = { ...this.usuario };

    if (this.usuarioEditado.fecha_nacimiento) {
      const fecha = new Date(this.usuarioEditado.fecha_nacimiento);
      if (!isNaN(fecha.getTime())) {
        this.usuarioEditado.fecha_nacimiento = fecha.toISOString().split('T')[0];
      }
    }
  }

  guardar(): void {
    if (!this.validarFormulario()) {
      return;
    }

    this.guardando = true;
    this.mensajeError = '';

    const datosParaEnviar = { ...this.usuarioEditado };

    if (this.nuevaContrasena.trim()) {
      (datosParaEnviar as any).password = this.nuevaContrasena;
    }

    this.adminService.actualizarUsuario(this.usuario.id, datosParaEnviar).subscribe({
      next: (response) => {
        this.actualizado.emit(response);
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

  getGeneroTexto(): string {
    const genero = this.generos.find(g => g.valor === this.usuarioEditado.genero);
    return genero ? genero.texto : 'No especificado';
  }

  getRolNombre(): string {
    const rol = this.roles.find(r => r.id === this.usuarioEditado.rol_id);
    return rol ? rol.nombre : 'USUARIO';
  }

  getEstadoTexto(): string {
    return this.usuarioEditado.activo ? 'Activo' : 'Inactivo';
  }

  getEstadoBadgeClass(): string {
    return this.usuarioEditado.activo
      ? 'bg-green-100 text-green-800'
      : 'bg-red-100 text-red-800';
  }

  formatearFecha(fecha: string | Date): string {
    if (!fecha) return 'No especificada';
    return new Date(fecha).toLocaleDateString('es-ES');
  }

  handleImageError(event: any): void {
    event.target.style.display = 'none';
  }

  getInitials(): string {
    return this.usuarioEditado.nombre
      ? this.usuarioEditado.nombre.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2)
      : 'US';
  }

  getAvatarUrl(): string {
    return this.usuarioEditado.avatar_url || '';
  }
}