import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs'; 
import { environment } from '../../../../environments/environment';
import { Ranking, FiltroRanking } from '../../../shared/models';

@Injectable({
  providedIn: 'root'
})
export class RankingsService {
  private apiUrl = `${environment.apiUrl}/ranking`;

  constructor(private http: HttpClient) { }


  obtenerRankingGlobal(): Observable<Ranking[]> {
    return this.http.get<Ranking[]>(`${this.apiUrl}/global`);
  }

  obtenerRankingDesafio(desafioId: number): Observable<Ranking[]> {
    return this.http.get<Ranking[]>(`${this.apiUrl}/desafio/${desafioId}`);
  }

  obtenerRankingConFiltros(filtros: FiltroRanking): Observable<Ranking[]> {
    let url = `${this.apiUrl}/filtrado`;
    const params: string[] = [];
    
    if (filtros.tipo) params.push(`tipo=${filtros.tipo}`);
    if (filtros.desafioId) params.push(`desafioId=${filtros.desafioId}`);
    if (filtros.fechaInicio) params.push(`fechaInicio=${filtros.fechaInicio.toISOString()}`);
    if (filtros.fechaFin) params.push(`fechaFin=${filtros.fechaFin.toISOString()}`);
    if (filtros.limit) params.push(`limit=${filtros.limit}`);
    
    if (params.length > 0) {
      url += '?' + params.join('&');
    }
    
    return this.http.get<Ranking[]>(url);
  }

  
  obtenerEstadisticasDesafio(desafioId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/desafio/${desafioId}/estadisticas`);
  }

  obtenerMiPosicion(desafioId: number): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/desafio/${desafioId}/mi-posicion`);
  }
}