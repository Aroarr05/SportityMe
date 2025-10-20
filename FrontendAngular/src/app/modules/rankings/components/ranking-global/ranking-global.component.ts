import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs'; 
import { RankingsService } from '../../services/rankings.service';
import { Ranking, FiltroRanking } from '../../../../shared/models';

@Component({
  selector: 'app-ranking',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './ranking-global.component.html',
  styleUrls: ['./ranking-global.component.scss']
})

export class RankingComponent implements OnInit {
  ranking: Ranking[] = [];
  cargando: boolean = false;
  error: string = '';
  
  filtros: FiltroRanking = {
    tipo: 'global',
    limit: 50
  };

  tiposRanking = [
    { value: 'global', label: 'Ranking Global' },
    { value: 'desafio', label: 'Por Desafío' }
  ];

  limites = [10, 25, 50, 100];

  constructor(
    private rankingsService: RankingsService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    const desafioId = this.route.snapshot.paramMap.get('desafioId');
    if (desafioId) {
      this.filtros.tipo = 'desafio';
      this.filtros.desafioId = +desafioId;
    }
    
    this.cargarRanking();
  }

  cargarRanking() {
    this.cargando = true;
    this.error = '';

    let request: Observable<Ranking[]>;
    
    if (this.filtros.tipo === 'global') {
      request = this.rankingsService.obtenerRankingGlobal();
    } else if (this.filtros.tipo === 'desafio' && this.filtros.desafioId) {
      request = this.rankingsService.obtenerRankingDesafio(this.filtros.desafioId);
    } else {
      request = this.rankingsService.obtenerRankingConFiltros(this.filtros);
    }

    request.subscribe({
      next: (data: Ranking[]) => { 
        this.ranking = data;
        this.cargando = false;
      },
      error: (error: any) => { 
        this.error = 'Error al cargar el ranking';
        this.cargando = false;
        console.error('Error:', error);
      }
    });
  }

  aplicarFiltros() {
    this.cargarRanking();
  }

  limpiarFiltros() {
    this.filtros = {
      tipo: 'global',
      limit: 50
    };
    this.cargarRanking();
  }

  obtenerClasePosicion(posicion: number): string {
    switch (posicion) {
      case 1: return 'primero';
      case 2: return 'segundo';
      case 3: return 'tercero';
      default: return '';
    }
  }
}