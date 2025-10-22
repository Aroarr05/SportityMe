import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RankingService } from '../../services/rankings.service';
import { Ranking,FiltroRanking } from '../../../../shared/models';

@Component({
  selector: 'app-ranking-global',
  templateUrl: './ranking-global.component.html',
  styleUrls: ['./ranking-global.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})

export class RankingGlobalComponent implements OnInit {
  rankingData: Ranking[] = [];
  loading: boolean = false;
  errorMessage: string = '';
  
  tipoSeleccionado: 'global' | 'desafio' = 'global';
  limitSeleccionado: number = 10;
  desafioIdSeleccionado?: number;

  desafios = [
    { id: 1, nombre: 'Desafío Running' },
    { id: 2, nombre: 'Desafío Natación' },
    { id: 3, nombre: 'Desafío Ciclismo' }
  ];

  topUsuarios: any[] = [];
  estadisticas: any = {};

  constructor(private rankingService: RankingService) { }

  ngOnInit(): void {
    this.cargarRanking();
  }

  cargarRanking(): void {
    this.loading = true;
    this.errorMessage = '';

    const filtros: FiltroRanking = {
      tipo: this.tipoSeleccionado,
      limit: this.limitSeleccionado
    };

    if (this.tipoSeleccionado === 'desafio') {
      if (!this.desafioIdSeleccionado) {
        this.errorMessage = 'Para ver el ranking por desafío, debes seleccionar un desafío.';
        this.loading = false;
        return;
      }
      filtros.desafioId = this.desafioIdSeleccionado;
    }

    this.rankingService.getRankingFiltrado(filtros)
      .subscribe({
        next: (data) => {
          this.rankingData = data;
          this.prepararDatosGraficas();
          this.loading = false;
        },
        error: (error) => {
          console.error('Error al cargar ranking:', error);
          this.errorMessage = 'Error al cargar el ranking. Por favor, intenta nuevamente.';
          this.loading = false;
        }
      });
  }

  prepararDatosGraficas(): void {
    this.topUsuarios = this.rankingData.slice(0, 3).map((item, index) => ({
      ...item,
      posicionReal: index + 1,
      alturaPodio: index === 0 ? 120 : index === 1 ? 90 : 70
    }));

    if (this.rankingData.length > 0) {
      const valores = this.rankingData.map(item => {
        if (this.tipoSeleccionado === 'global') {
          return item.totalDesafiosCompletados || 0;
        } else {
          return item.progresoActual ? Number(item.progresoActual) : 0;
        }
      });

      this.estadisticas = {
        totalUsuarios: this.rankingData.length,
        promedioPuntuacion: Math.round(valores.reduce((sum, val) => sum + val, 0) / valores.length),
        maxPuntuacion: Math.max(...valores),
        usuarioDestacado: this.rankingData[0]?.nombre || 'N/A'
      };
    }
  }

  cambiarTipo(event: any): void {
    this.tipoSeleccionado = event.target.value;
    if (this.tipoSeleccionado === 'global') {
      this.desafioIdSeleccionado = undefined;
    }
    this.cargarRanking();
  }

  cambiarLimit(event: any): void {
    this.limitSeleccionado = Number(event.target.value);
    this.cargarRanking();
  }

  cambiarDesafio(event: any): void {
    const value = event.target.value;
    this.desafioIdSeleccionado = value ? Number(value) : undefined;
    if (this.tipoSeleccionado === 'desafio') {
      this.cargarRanking();
    }
  }

  limpiarFiltros(): void {
    this.tipoSeleccionado = 'global';
    this.limitSeleccionado = 10;
    this.desafioIdSeleccionado = undefined;
    this.cargarRanking();
  }

  getMedalClass(posicion: number): string {
    switch(posicion) {
      case 1: return 'gold';
      case 2: return 'silver';
      case 3: return 'bronze';
      default: return '';
    }
  }

  getProgressColor(progreso: number): string {
    if (progreso >= 80) return '#10b981';
    if (progreso >= 60) return '#f59e0b';
    if (progreso >= 40) return '#ef4444';
    return '#6b7280';
  }

  getValorDisplay(item: Ranking): number {
    if (this.tipoSeleccionado === 'global') {
      return item.totalDesafiosCompletados || 0;
    } else {
      return item.progresoActual ? Number(item.progresoActual) : 0;
    }
  }
}