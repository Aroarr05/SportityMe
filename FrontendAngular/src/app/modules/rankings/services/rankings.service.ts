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

  getRankingPorDesafio(desafioId: number, limit?: number): Observable<Ranking[]> {
    let params = new HttpParams();
    if (limit) {
      params = params.set('limit', limit.toString());
    }
    return this.http.get<Ranking[]>(`${this.apiUrl}/desafio/${desafioId}`, { params });
  }

  getRankingFiltrado(filtros: FiltroRanking): Observable<Ranking[]> {
    if (filtros.tipo === 'desafio' && filtros.desafioId) {
      return this.getRankingPorDesafio(filtros.desafioId, filtros.limit);
    } else {
      return this.getRankingGlobal(filtros.limit);
    }
  }
}