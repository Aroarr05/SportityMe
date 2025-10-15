import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Progreso, CrearProgresoDto, UnidadMedida } from '../../../shared/models/progreso.model';

@Injectable({
  providedIn: 'root'
})
export class ProgresosService {
  private apiUrl = `${environment.apiUrl}/progresos`;

  constructor(private http: HttpClient) { }

  obtenerResumenProgresos(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/resumen`);
  }

  obtenerProgresosPorDesafio(): Observable<Progreso[]> {
    return this.http.get<Progreso[]>(`${this.apiUrl}/por-desafio`);
  }

  registrarProgreso(progresoDto: CrearProgresoDto): Observable<Progreso> {
    return this.http.post<Progreso>(this.apiUrl, progresoDto);
  }

  obtenerProgresosDesafio(desafioId: number): Observable<Progreso[]> {
    return this.http.get<Progreso[]>(`${this.apiUrl}/desafio/${desafioId}`);
  }
}