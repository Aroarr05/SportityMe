import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RankingService } from '../../services/rankings.service';
import { Ranking, FiltroRanking } from '../../../../shared/models';
import { TipoActividad } from '../../../../shared/models'; 

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
  
  desafioIdSeleccionado?: number;
  limitSeleccionado: number = 50;

  desafios = [
    { id: 1, nombre: 'Desafío Running', tipo: TipoActividad.CORRER },
    { id: 2, nombre: 'Desafío Natación', tipo: TipoActividad.NADAR },
    { id: 3, nombre: 'Desafío Ciclismo', tipo: TipoActividad.CICLISMO },
    { id: 4, nombre: 'Desafío Gimnasio', tipo: TipoActividad.GIMNASIO },
    { id: 5, nombre: 'Desafío Senderismo', tipo: TipoActividad.SENDERISMO },
    { id: 6, nombre: 'Desafío Yoga', tipo: TipoActividad.YOGA }
  ];

  topUsuarios: any[] = [];
  rankingCompleto: any[] = [];

  constructor(private rankingService: RankingService) { }

  ngOnInit(): void {
    if (this.desafios.length > 0) {
      this.desafioIdSeleccionado = this.desafios[0].id;
      this.cargarRanking();
    }
  }

  cargarRanking(): void {
    if (!this.desafioIdSeleccionado) {
      this.errorMessage = 'Debes seleccionar un desafío.';
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    const desafioSeleccionado = this.desafios.find(d => d.id === this.desafioIdSeleccionado);
    
    const filtros: FiltroRanking = {
      tipo: 'desafio',
      desafioId: this.desafioIdSeleccionado,
      tipoActividad: desafioSeleccionado?.tipo, 
      limit: this.limitSeleccionado
    };

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

    this.rankingCompleto = this.rankingData.map((item, index) => ({
      ...item,
      posicionReal: index + 1
    }));
  }

  cambiarDesafio(event: any): void {
    const value = event.target.value;
    this.desafioIdSeleccionado = value ? Number(value) : undefined;
    this.cargarRanking();
  }

  cambiarLimit(event: any): void {
    this.limitSeleccionado = Number(event.target.value);
    this.cargarRanking();
  }

  getValorDisplay(item: Ranking): number {
    return item.progresoActual ? Number(item.progresoActual) : 0;
  }

  getProgressColor(progreso: number): string {
    if (progreso >= 80) return '#10b981';
    if (progreso >= 60) return '#f59e0b';
    if (progreso >= 40) return '#ef4444';
    return '#6b7280';
  }

  getDesafioIcon(desafioId: number): string {
    const desafio = this.desafios.find(d => d.id === desafioId);
    switch(desafio?.tipo) {
      case TipoActividad.CORRER: return '';
      case TipoActividad.NADAR: return '';
      case TipoActividad.CICLISMO: return '';
      case TipoActividad.GIMNASIO: return '';
      case TipoActividad.SENDERISMO: return '';
      case TipoActividad.YOGA: return '';
      default: return '';
    }
  }
}