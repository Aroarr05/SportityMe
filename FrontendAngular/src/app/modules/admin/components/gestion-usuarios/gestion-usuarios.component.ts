import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminService } from '../../services/admin.service';
import { AuthService } from '../../../../auth/services/auth.service';
import { Usuario } from '../../../../shared/models';

import { ListaUsuariosComponent } from './lista-usuarios/lista-usuarios.component';
import { CrearUsuarioComponent } from './crear-usuario/crear-usuario.component';
import { EditarUsuarioComponent } from './editar-usuario/editar-usuario.component';
import { DetalleUsuarioComponent } from './detalle-usuario/detalle-usuario.component';

@Component({
  selector: 'app-gestion-usuarios',
  standalone: true,
  imports: [
    CommonModule,
    ListaUsuariosComponent,
    CrearUsuarioComponent,
    EditarUsuarioComponent,
    DetalleUsuarioComponent
  ],
  templateUrl: './gestion-usuarios.component.html'
})
export class GestionUsuariosComponent implements OnInit {
  usuarios: Usuario[] = [];
  vistaActual: 'lista' | 'crear' | 'editar' | 'detalle' = 'lista';
  usuarioSeleccionado: Usuario | null = null;
  cargando = true;
  mensajeError = '';

  constructor(
    private adminService: AdminService,
    private authService: AuthService
  ) { }

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

  mostrarLista(): void {
    this.vistaActual = 'lista';
    this.usuarioSeleccionado = null;
  }

  mostrarCrear(): void {
    this.vistaActual = 'crear';
  }

  mostrarEditar(usuario: Usuario): void {
    this.usuarioSeleccionado = usuario;
    this.vistaActual = 'editar';
  }

  mostrarDetalle(usuario: Usuario): void {
    this.usuarioSeleccionado = usuario;
    this.vistaActual = 'detalle';
  }

  onUsuarioCreado(): void {
    this.mostrarLista();
  }

  onUsuarioActualizado(): void {
    this.mostrarLista();
  }

  onCancelar(): void {
    this.mostrarLista();
  }

  eliminarUsuario(id: number): void {
    this.adminService.eliminarUsuario(id).subscribe({
      next: () => {
        this.usuarios = this.usuarios.filter(usuario => usuario.id !== id);
      },
      error: (error) => {
        console.error('Error eliminando usuario:', error);
      }
    });
  }
}