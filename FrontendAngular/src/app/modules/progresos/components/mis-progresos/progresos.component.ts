import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ProgresosService } from '../../services/progresos.service';

@Component({
  selector: 'app-mis-progresos',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './progresos.component.html',
  styleUrls: ['./progresos.component.scss']
})

export class MisProgresosComponent implements OnInit {
  progresos: any[] = [];
  cargando: boolean = false;
  error: string = '';
  mostrarModalEdicion: boolean = false;
  progresoEditando: any = null;
  guardando: boolean = false;
  menuAbierto: number | null = null;
  formularioEdicion: FormGroup;

  estadisticas = {
    totalRegistros: 0,
    desafiosActivos: 0,
    progresoPromedio: 0,
    ultimoRegistro: ''
  };

  constructor(
    private progresosService: ProgresosService,
    private router: Router,
    private fb: FormBuilder
  ) {
    this.formularioEdicion = this.fb.group({
      porcentaje: ['', [Validators.required, Validators.min(0), Validators.max(100)]],
      comentario: ['']
    });
  }

  ngOnInit() {
    this.cargarProgresos();
  }

  cargarProgresos() {
    this.cargando = true;
    this.error = '';

    this.progresosService.obtenerMiHistorial().subscribe({
      next: (data: any) => {
        this.progresos = data;
        this.calcularEstadisticas();
        this.cargando = false;
      },
      error: (error) => {
        this.error = 'Error al cargar los progresos';
        this.cargando = false;
      }
    });
  }

  calcularEstadisticas() {
    this.estadisticas.totalRegistros = this.progresos.length;

    const desafiosUnicos = new Set(this.progresos.map(p => p.desafioId));
    this.estadisticas.desafiosActivos = desafiosUnicos.size;

    if (this.progresos.length > 0) {
      const sumaProgresos = this.progresos.reduce((sum, p) => sum + this.calcularPorcentajeReal(p), 0);
      this.estadisticas.progresoPromedio = Math.round(sumaProgresos / this.progresos.length);
    }

    if (this.progresos.length > 0) {
      const ultimo = this.progresos[0];
      this.estadisticas.ultimoRegistro = this.formatearFecha(ultimo.fechaRegistro);
    }
  }

  get desafiosUnicos(): any[] {
    const agrupados: { [key: string]: any } = {};

    this.progresos.forEach(progreso => {
      if (progreso.desafioId) {
        const clave = progreso.desafioId.toString();
        if (!agrupados[clave]) {
          agrupados[clave] = [];
        }
        agrupados[clave].push(progreso);
      }
    });

    const ultimosProgresos: any[] = [];
    Object.values(agrupados).forEach((progresos: any[]) => {
      if (progresos.length > 0) {
        const ultimo = progresos.sort((a, b) =>
          new Date(b.fechaRegistro).getTime() - new Date(a.fechaRegistro).getTime()
        )[0];
        ultimosProgresos.push(ultimo);
      }
    });

    return ultimosProgresos;
  }

  navegarARegistrar() {
    this.router.navigate(['/progresos', 'registrar']);
  }

  verDetalleDesafio(desafioId: number) {
    this.router.navigate(['/desafios', desafioId]);
  }

  formatearFecha(fecha: string | Date): string {
    return new Date(fecha).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  obtenerNombreDesafio(progreso: any): string {
    if (progreso.desafio) {
      return progreso.desafio.titulo;
    }
    return `Desafío ${progreso.desafioId || 'N/A'}`;
  }

  obtenerObjetivoDesafio(progreso: any): string {
    if (progreso.desafio) {
      return `${progreso.desafio.objetivo} ${progreso.desafio.unidadObjetivo}`;
    }
    return 'Objetivo no disponible';
  }

  calcularPorcentajeReal(progreso: any): number {
    if (progreso.completado) {
      return 100;
    }

    if (progreso.porcentajeCompletado) {
      return Math.min(progreso.porcentajeCompletado, 100);
    }

    if (progreso.desafio && progreso.desafio.objetivo) {
      const objetivo = Number(progreso.desafio.objetivo);
      const valorActual = Number(progreso.valorActual) || 0;

      if (objetivo > 0) {
        const porcentaje = Math.min((valorActual / objetivo) * 100, 100);
        return Math.round(porcentaje);
      }
    }

    return 0;
  }

  toggleMenu(progresoId: number) {
    this.menuAbierto = this.menuAbierto === progresoId ? null : progresoId;
  }

  editarPorcentaje(progreso: any) {
    this.progresoEditando = progreso;
    const porcentajeActual = this.calcularPorcentajeReal(progreso);
    this.formularioEdicion.patchValue({
      porcentaje: porcentajeActual,
      comentario: progreso.comentario || ''
    });
    this.mostrarModalEdicion = true;
    this.menuAbierto = null;
  }

  guardarPorcentaje() {
    if (this.formularioEdicion.valid && this.progresoEditando) {
      this.guardando = true;

      const porcentaje = this.formularioEdicion.value.porcentaje;
      const valorActual = this.calcularValorDesdePorcentaje(porcentaje);
      const comentario = this.formularioEdicion.value.comentario;

      const datosActualizacion = {
        valorActual: valorActual,
        unidad: this.progresoEditando.unidad,
        comentario: comentario,
        dispositivo: this.progresoEditando.dispositivo || ''
      };

      const progresoId = Number(this.progresoEditando.id);

      this.progresosService.actualizarProgreso(
        progresoId,
        datosActualizacion
      ).subscribe({
        next: (progresoActualizado) => {
          const index = this.progresos.findIndex(p => p.id === this.progresoEditando.id);
          if (index !== -1) {
            this.progresos[index] = progresoActualizado;
          }
          this.cerrarModal();
          this.calcularEstadisticas();
          this.guardando = false;
        },
        error: (error) => {
          console.error('Error al actualizar progreso:', error);
          this.guardando = false;
          this.error = 'Error al actualizar el progreso';
        }
      });
    }
  }

  calcularValorDesdePorcentaje(porcentaje: number): number {
    if (this.progresoEditando.desafio && this.progresoEditando.desafio.objetivo) {
      const objetivo = Number(this.progresoEditando.desafio.objetivo);
      const valorCalculado = (porcentaje / 100) * objetivo;
      return Math.round(valorCalculado * 100) / 100;
    }
    return this.progresoEditando.valorActual || 0;
  }

  eliminarProgreso(progresoId: number) {
    this.progresosService.eliminarProgreso(progresoId).subscribe({
      next: () => {
        this.progresos = this.progresos.filter(p => p.id !== progresoId);
        this.calcularEstadisticas();
        this.menuAbierto = null;
      },
      error: (error) => {
        console.error('Error al eliminar progreso:', error);
      }
    });
  }

  cerrarModal() {
    this.mostrarModalEdicion = false;
    this.progresoEditando = null;
    this.formularioEdicion.reset();
  }
}