import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListaDesafiosComponent } from './lista-desafios/lista-desafios.component';
import { CrearDesafioComponent } from './crear-desafio/crear-desafio.component';
import { EditarDesafioComponent } from './editar-desafio/editar-desafio.component';
import { DetalleDesafioComponent } from './detalle-desafio/detalle-desafio.component';
import { AdminService } from '../../services/admin.service';
import { Desafio } from '../../../../shared/models';

@Component({
  selector: 'app-gestion-desafios',
  standalone: true,
  imports: [
    CommonModule,
    ListaDesafiosComponent,
    DetalleDesafioComponent,
    CrearDesafioComponent,
    EditarDesafioComponent
  ],
  templateUrl: './gestion-desafios.component.html'
})

export class GestionDesafiosComponent implements OnInit {
  desafios: Desafio[] = [];
  vistaActual: 'lista' | 'crear' | 'editar' | 'detalle' = 'lista';
  desafioSeleccionado: Desafio | null = null;
  cargando = true;

  constructor(private adminService: AdminService) { }

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

  mostrarLista(): void {
    this.vistaActual = 'lista';
    this.desafioSeleccionado = null;
  }

  mostrarCrear(): void {
    this.vistaActual = 'crear';
  }

  mostrarEditar(desafio: Desafio): void {
    this.desafioSeleccionado = desafio;
    this.vistaActual = 'editar';
  }

  mostrarDetalle(desafio: Desafio): void {
    this.desafioSeleccionado = desafio;
    this.vistaActual = 'detalle';
  }

  onDesafioCreado(): void {
    this.mostrarLista();
  }

  onDesafioActualizado(): void {
    this.mostrarLista();
  }

  onCancelar(): void {
    this.mostrarLista();
  }

  eliminarDesafio(id: number): void {
    this.adminService.eliminarDesafio(id).subscribe({
      next: () => {
        this.desafios = this.desafios.filter(desafio => desafio.id !== id);
      },
      error: (error) => {
        console.error('Error eliminando desafío:', error);
      }
    });
  }
}