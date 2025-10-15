import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Desafio } from '../../../shared/models';
import { CrearDesafioDto } from '../dto/crear-desafio.dto';

@Injectable({
  providedIn: 'root'
})
export class DesafiosService {
  private apiUrl = `${environment.apiUrl}/desafios`;

  constructor(private http: HttpClient) { }

  obtenerDesafios(): Observable<Desafio[]> {
    return this.http.get<Desafio[]>(this.apiUrl);
  }

  obtenerDesafioPorId(id: number): Observable<Desafio> {
    return this.http.get<Desafio>(`${this.apiUrl}/${id}`);
  }

  crearDesafio(desafioDto: CrearDesafioDto): Observable<Desafio> {
    return this.http.post<Desafio>(this.apiUrl, desafioDto);
  }

  actualizarDesafio(id: number, desafio: Partial<Desafio>): Observable<Desafio> {
    return this.http.put<Desafio>(`${this.apiUrl}/${id}`, desafio);
  }

  eliminarDesafio(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  unirseADesafio(id: number): Observable<Desafio> {
    return this.http.post<Desafio>(`${this.apiUrl}/${id}/unirse`, {});
  }

  obtenerParticipantes(desafioId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/${desafioId}/participantes`);
  }

  obtenerDesafiosActivos(): Observable<Desafio[]> {
    return this.http.get<Desafio[]>(`${this.apiUrl}/activos`);
  }
}