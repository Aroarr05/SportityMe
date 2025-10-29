import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ProgresosService } from '../../services/progresos.service';
import { Progreso } from '../../../../shared/models';

@Component({
  selector: 'app-mis-progresos',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './mis-progresos.component.html',
  styleUrls: ['./mis-progresos.component.scss']
})

export class MisProgresosComponent implements OnInit {
  progresos: Progreso[] = [];
  cargando: boolean = false;
  error: string = '';

  estadisticas = {
    totalRegistros: 0,
    desafiosActivos: 0,
    progresoPromedio: 0,
    ultimoRegistro: ''
  };

  constructor(
    private progresosService: ProgresosService,
    private router: Router
  ) {}

  ngOnInit() {
    this.cargarProgresos();
  }

  cargarProgresos() {
    this.cargando = true;
    this.error = '';

    this.progresosService.obtenerMiHistorial().subscribe({
      next: (data) => {
        console.log('✅ Datos recibidos:', data); 
        this.progresos = data;
        this.calcularEstadisticas();
        this.cargando = false;
      },
      error: (error) => {
        console.error('❌ Error completo:', error);
        console.error('❌ Status:', error.status);
        console.error('❌ Mensaje:', error.message);
        
        this.error = 'Error al cargar los progresos';
        if (error.status === 403) {
          this.error += ' - No tienes permisos';
        } else if (error.status === 401) {
          this.error += ' - Sesión expirada';
        }
        this.cargando = false;
      }
    });
  }

  calcularEstadisticas() {
    this.estadisticas.totalRegistros = this.progresos.length;
    
  
    const desafiosUnicos = new Set(this.progresos.map(p => p.desafio_id));
    this.estadisticas.desafiosActivos = desafiosUnicos.size;

    if (this.progresos.length > 0) {
      const sumaProgresos = this.progresos.reduce((sum, p) => sum + (p.porcentaje_completado || 0), 0);
      this.estadisticas.progresoPromedio = Math.round(sumaProgresos / this.progresos.length);
    }

    if (this.progresos.length > 0) {
      const ultimo = this.progresos[0];
      this.estadisticas.ultimoRegistro = this.formatearFecha(ultimo.fecha_registro);
    }
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

  obtenerNombreDesafio(progreso: Progreso): string {
    if (progreso.desafio) {
      return progreso.desafio.titulo;
    }
    return `Desafío ${progreso.desafio_id}`;
  }
  obtenerObjetivoDesafio(progreso: Progreso): string {
    if (progreso.desafio) {
      return `${progreso.desafio.objetivo} ${progreso.desafio.unidad_objetivo}`;
    }
    return 'Objetivo no disponible';
  }

  get progresosAgrupados(): { [key: string]: Progreso[] } {
    const agrupados: { [key: string]: Progreso[] } = {};
    
    this.progresos.forEach(progreso => {

      const clave = progreso.desafio_id.toString();
      if (!agrupados[clave]) {
        agrupados[clave] = [];
      }
      agrupados[clave].push(progreso);
    });
    
    return agrupados;
  }

  get desafiosUnicos(): Progreso[] {
    const ultimosProgresos: Progreso[] = [];
    Object.values(this.progresosAgrupados).forEach(progresos => {
      const ultimo = progresos.sort((a, b) => 
        new Date(b.fecha_registro).getTime() - new Date(a.fecha_registro).getTime()
      )[0];
      ultimosProgresos.push(ultimo);
    });
    
    return ultimosProgresos;
  }

  obtenerPorcentaje(progreso: Progreso): number {

    return progreso.porcentaje_completado || 0;
  }

  estaCompletado(progreso: Progreso): boolean {
    return progreso.completado || false;
  }
}