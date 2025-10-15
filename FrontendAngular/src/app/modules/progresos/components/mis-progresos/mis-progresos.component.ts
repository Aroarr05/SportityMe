import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ProgresosService } from '../../services/progresos.service';

@Component({
  standalone: true,
  selector: 'app-mis-progresos',
  templateUrl: './mis-progresos.component.html',
  styleUrls: ['./mis-progresos.component.scss'],
  imports: [
    CommonModule,
    RouterModule
  ]
})
export class MisProgresosComponent implements OnInit {
  resumen: any;
  progresosPorDesafio: any[] = [];
  loading = true;
  error: string | null = null;

  constructor(private progresosService: ProgresosService) {}

  ngOnInit(): void {
    this.cargarDatos();
  }

  cargarDatos() {
    this.loading = true;
    this.error = null;
    this.progresosService.obtenerResumenProgresos().subscribe({
      next: (resumen) => {
        this.resumen = resumen;
        this.verificarCargaCompleta();
      },
      error: (err) => {
        console.error('Error al cargar resumen:', err);
        this.error = 'Error al cargar el resumen de progresos';
        this.loading = false;
      }
    });

    this.progresosService.obtenerProgresosPorDesafio().subscribe({
      next: (progresos) => {
        this.progresosPorDesafio = progresos;
        this.verificarCargaCompleta();
      },
      error: (err) => {
        console.error('Error al cargar progresos:', err);
        this.error = 'Error al cargar los progresos por desafío';
        this.loading = false;
      }
    });
  }

  private verificarCargaCompleta() {
    if (this.resumen !== undefined && this.progresosPorDesafio !== undefined) {
      this.loading = false;
    }
  }

  recargar() {
    this.cargarDatos();
  }
}