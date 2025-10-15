import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../enviroments/environment';
import { Desafio } from '../../../shared/models';
import { CrearDesafioDto } from '../dto/crear-desafio.dto';

@Injectable({
  providedIn: 'root'
})
export class DesafiosService {
  private apiUrl = `${environment.apiUrl}/desafios`;

  constructor(private http: HttpClient) { }

  getDesafios(): Observable<Desafio[]> {
    return this.http.get<Desafio[]>(this.apiUrl);
  }

  getDesafioById(id: number): Observable<Desafio> {
    return this.http.get<Desafio>(`${this.apiUrl}/${id}`);
  }

  crearDesafio(desafioDto: CrearDesafioDto): Observable<Desafio> {
    return this.http.post<Desafio>(this.apiUrl, desafioDto);
  }

  unirseADesafio(desafioId: number): Observable<Desafio> {
    return this.http.post<Desafio>(`${this.apiUrl}/${desafioId}/unirse`, {});
  }
}