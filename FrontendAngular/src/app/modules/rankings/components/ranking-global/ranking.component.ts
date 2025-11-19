import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { RankingService } from '../../services/rankings.service';
import { Ranking } from '../../../../shared/models';

@Component({
  selector: 'app-ranking',
  templateUrl: './ranking.component.html',
  styleUrls: ['./ranking.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule]
})

export class RankingComponent implements OnInit {
  rankingData: Ranking[] = [];
  loading: boolean = true;
  errorMessage: string = '';

  desafioIdSeleccionado: number | null = null;
  limitSeleccionado: number = 10;

  desafios = [
    { id: 1, nombre: 'Desafío Running', tipo: 'correr', icono: 'fa-running' },
    { id: 2, nombre: 'Desafío Natación', tipo: 'natacion', icono: 'fa-swimmer' },
    { id: 3, nombre: 'Desafío Ciclismo', tipo: 'ciclismo', icono: 'fa-bicycle' },
    { id: 4, nombre: 'Desafío Gimnasio', tipo: 'gimnasio', icono: 'fa-dumbbell' },
    { id: 5, nombre: 'Desafío Otros', tipo: 'otros', icono: 'fa-running' }
  ];

  topUsuarios: Ranking[] = [];
  rankingCompleto: Ranking[] = [];

  constructor(
    private rankingService: RankingService,
    private cdRef: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.cargarRanking();
  }

  cargarRanking(): void {
    this.loading = true;
    this.errorMessage = '';

    if (this.desafioIdSeleccionado) {
      this.rankingService.getRankingPorDesafio(this.desafioIdSeleccionado, this.limitSeleccionado)
        .subscribe({
          next: (data) => {
            this.procesarDatosRanking(data);
            this.loading = false;
          },
          error: (error) => {
            console.error('Error al cargar ranking:', error);
            this.errorMessage = 'Error al cargar el ranking. Por favor, intenta nuevamente.';
            this.loading = false;
          }
        });
    } else {
      this.rankingService.getRankingGlobal(this.limitSeleccionado)
        .subscribe({
          next: (data) => {
            this.procesarDatosRanking(data);
            this.loading = false;
          },
          error: (error) => {
            console.error('Error al cargar ranking global:', error);
            this.errorMessage = 'Error al cargar el ranking. Por favor, intenta nuevamente.';
            this.loading = false;
          }
        });
    }
  }

  onDesafioChange(): void {
    this.cargarRanking();
  }

  onLimitChange(): void {
    this.cargarRanking();
  }

  procesarDatosRanking(data: Ranking[]): void {
    this.rankingData = [...data.map((item, index) => ({
      ...item,
      posicion: index + 1
    }))];

    this.topUsuarios = [...this.rankingData.slice(0, Math.min(3, this.rankingData.length))];
    this.rankingCompleto = [...this.rankingData];
    this.cdRef.detectChanges();
  }

  getValorDisplay(item: Ranking): number {
    return item.porcentajeCompletado ? Math.round(item.porcentajeCompletado) : 0;
  }

  getProgressColor(progreso: number): string {
    if (progreso >= 80) return '#10b981';
    if (progreso >= 60) return '#f59e0b';
    if (progreso >= 40) return '#ef4444';
    return '#6b7280';
  }

  getDesafioNombre(desafioId: number): string {
    const desafio = this.desafios.find(d => d.id === desafioId);
    return desafio?.nombre || 'Desafío';
  }

  getTituloVista(): string {
    return this.desafioIdSeleccionado 
      ? this.getDesafioNombre(this.desafioIdSeleccionado)
      : 'Ranking Global';
  }

  getDescripcionVista(): string {
    return this.desafioIdSeleccionado 
      ? 'Progreso en este desafío específico'
      : 'Progreso promedio en todos los desafíos';
  }

  mostrarPodio(): boolean {
    return this.topUsuarios.length > 0 && !this.loading;
  }
}