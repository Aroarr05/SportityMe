import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { RankingsService } from '../../services/rankings.service';
import { RankingDesafio, Ranking } from '../../../../shared/models';

@Component({
  standalone: true,
  selector: 'app-ranking-global',
  templateUrl: './ranking-global.component.html',
  styleUrls: ['./ranking-global.component.scss'],
  imports: [CommonModule, FormsModule, RouterModule]
})
export class RankingGlobalComponent implements OnInit {
  loading = false;
  error: string | null = null;
  ranking: Ranking[] = [];
  nombreDesafio: string = '';
  desafioId: number = 1;

  constructor(private rankingsService: RankingsService) {}

  ngOnInit(): void {
    this.cargarRankingDesafio();
  }

  cargarRankingDesafio(): void {
    this.loading = true;
    this.error = null;
    
    this.rankingsService.obtenerRankingDesafio(this.desafioId).subscribe({
      next: (rankingDesafio: RankingDesafio) => {
        this.ranking = rankingDesafio.ranking || [];
        this.nombreDesafio = rankingDesafio.nombreDesafio || `Desafío ${this.desafioId}`;
        this.loading = false;
        console.log('✅ Ranking cargado:', rankingDesafio);
      },
      error: (err: any) => {
        this.loading = false;
        
        if (err.status === 403) {
          this.error = 'El ranking no está disponible para acceso público.';
        } else if (err.status === 404) {
          this.error = 'No se encontró ranking para este desafío.';
          this.ranking = [];
        } else {
          this.error = 'Error al cargar el ranking. Intenta nuevamente.';
          console.error('❌ Error:', err);
        }
      }
    });
  }

  cambiarDesafio(nuevoId: number): void {
    this.desafioId = nuevoId;
    this.cargarRankingDesafio();
  }

  getCardClass(index: number): string {
    if (index === 0) return 'bg-gradient-to-r from-yellow-50 to-yellow-100 border-yellow-200';
    if (index === 1) return 'bg-gradient-to-r from-gray-50 to-gray-100 border-gray-200';
    if (index === 2) return 'bg-gradient-to-r from-orange-50 to-orange-100 border-orange-200';
    return 'bg-white hover:bg-gray-50';
  }

  getAvatarColor(index: number): string {
    if (index === 0) return 'bg-yellow-500';
    if (index === 1) return 'bg-gray-500';
    if (index === 2) return 'bg-orange-500';
    const colors = ['bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-pink-500', 'bg-indigo-500'];
    return colors[index % colors.length];
  }

  getProgressBarColor(index: number): string {
    if (index === 0) return 'bg-yellow-500';
    if (index === 1) return 'bg-gray-500';
    if (index === 2) return 'bg-orange-500';
    return 'bg-blue-500';
  }

  getMedal(index: number): string {
    if (index === 0) return '🥇';
    if (index === 1) return '🥈';
    if (index === 2) return '🥉';
    return '';
  }

  getPuntuacionMedia(): number {
    if (this.ranking.length === 0) return 0;
    const total = this.ranking.reduce((sum, item) => sum + (item.puntuacion || 0), 0);
    return Math.round(total / this.ranking.length);
  }

  getMaxDesafios(): number {
    if (this.ranking.length === 0) return 0;
    return Math.max(...this.ranking.map(item => item.desafiosCompletados || 0));
  }

  reintentar(): void {
    this.cargarRankingDesafio();
  }
}