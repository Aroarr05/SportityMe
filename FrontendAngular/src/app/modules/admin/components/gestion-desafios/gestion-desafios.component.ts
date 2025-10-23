import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminService, Desafio } from '../../services/admin.service';

@Component({
  selector: 'app-gestion-desafios',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './gestion-desafios.component.html'
})

export class GestionDesafiosComponent implements OnInit {
  desafios: Desafio[] = [];
  desafioEditando: Partial<Desafio> = {};
  mostrarModal = false;
  esEdicion = false;
  cargando = true;

  constructor(private adminService: AdminService) {}

  ngOnInit(): void {
    this.cargarDesafios();
  }

  cargarDesafios(): void {
    this.cargando = true;
    this.adminService.getDesafios().subscribe({
      next: (desafios) => {
        this.desafios = desafios;
        this.cargando = false;
      },
      error: (error) => {
        console.error('Error cargando desafíos:', error);
        this.cargando = false;
      }
    });
  }

  abrirCrearDesafio(): void {
    this.desafioEditando = {
      tipo: 'CORRER',
      estado: 'ACTIVO',
      meta: 0
    };
    this.esEdicion = false;
    this.mostrarModal = true;
  }

  abrirEditarDesafio(desafio: Desafio): void {
    this.desafioEditando = { ...desafio };
    this.esEdicion = true;
    this.mostrarModal = true;
  }

  guardarDesafio(): void {
    if (this.esEdicion) {
      this.adminService.actualizarDesafio(this.desafioEditando.id!, this.desafioEditando).subscribe({
        next: () => {
          this.cargarDesafios();
          this.cerrarModal();
        },
        error: (error) => console.error('Error actualizando desafío:', error)
      });
    } else {
      this.adminService.crearDesafio(this.desafioEditando).subscribe({
        next: () => {
          this.cargarDesafios();
          this.cerrarModal();
        },
        error: (error) => console.error('Error creando desafío:', error)
      });
    }
  }

  eliminarDesafio(id: number): void {
    if (confirm('¿Estás seguro de que quieres eliminar este desafío?')) {
      this.adminService.eliminarDesafio(id).subscribe({
        next: () => {
          this.cargarDesafios();
        },
        error: (error) => console.error('Error eliminando desafío:', error)
      });
    }
  }

  cerrarModal(): void {
    this.mostrarModal = false;
    this.desafioEditando = {};
  }

  getEstadoBadgeClass(estado: string): string {
    switch (estado) {
      case 'ACTIVO': return 'bg-green-100 text-green-800';
      case 'INACTIVO': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  }

  getTipoBadgeClass(tipo: string): string {
    switch (tipo) {
      case 'CORRER': return 'bg-blue-100 text-blue-800';
      case 'NADAR': return 'bg-cyan-100 text-cyan-800';
      case 'CICLISMO': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  }
}