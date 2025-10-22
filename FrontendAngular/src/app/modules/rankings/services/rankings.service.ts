import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment'; 
import { Ranking, FiltroRanking } from '../../../shared/models';

@Injectable({
  providedIn: 'root'
})
export class RankingService {
  private apiUrl = `${environment.apiUrl}/ranking`; 

  constructor(private http: HttpClient) { }

  getRankingGlobal(limit?: number): Observable<Ranking[]> {
    let params = new HttpParams();
    if (limit) {
      params = params.set('limit', limit.toString());
    }
    return this.http.get<Ranking[]>(`${this.apiUrl}/global`, { params });
  }

  getRankingFiltrado(filtros: FiltroRanking): Observable<Ranking[]> {
    let params = new HttpParams()
      .set('tipo', filtros.tipo)
      .set('limit', filtros.limit?.toString() || '10');

    if (filtros.tipo === 'desafio' && filtros.desafioId) {
      params = params.set('desafioId', filtros.desafioId.toString());
    }
    
    return this.http.get<Ranking[]>(`${this.apiUrl}/filtrado`, { params });
  }

  getRankingPorDesafio(desafioId: number, limit?: number): Observable<Ranking[]> {
    let params = new HttpParams();
    if (limit) {
      params = params.set('limit', limit.toString());
    }
    return this.http.get<Ranking[]>(`${this.apiUrl}/desafio/${desafioId}`, { params });
  }

  getTotalParticipantesDesafio(desafioId: number): Observable<{totalParticipantes: number}> {
    return this.http.get<{totalParticipantes: number}>(`${this.apiUrl}/desafio/${desafioId}/participantes`);
  }

  esUsuarioParticipante(desafioId: number, usuarioId: number): Observable<{esParticipante: boolean}> {
    return this.http.get<{esParticipante: boolean}>(`${this.apiUrl}/desafio/${desafioId}/usuario/${usuarioId}/participante`);
  }
}