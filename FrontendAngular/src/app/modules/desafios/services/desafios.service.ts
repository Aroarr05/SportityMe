import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { Desafio } from '../../../shared/models';
import { CrearDesafioDto } from '../dto/crear-desafio.dto';
import { AuthService } from '../../../auth/services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class DesafiosService {
  private apiUrl = `${environment.apiUrl}/desafios`;
  private participacionesUrl = `${environment.apiUrl}/participaciones`;

  constructor(
    private http: HttpClient,
    private authService: AuthService 
  ) { }

  private getAuthHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    
    if (token) {
      return new HttpHeaders({
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      });
    } else {
      return new HttpHeaders({
        'Content-Type': 'application/json'
      });
    }
  }

  // SOLO métodos de API - NO lógica de filtrado
  obtenerDesafios(): Observable<Desafio[]> {
    return this.http.get<Desafio[]>(this.apiUrl);
  }

  obtenerDesafioPorId(id: number): Observable<Desafio> {
    return this.http.get<Desafio>(`${this.apiUrl}/${id}`);
  }

  crearDesafio(desafioDto: CrearDesafioDto): Observable<Desafio> {
    return this.http.post<Desafio>(this.apiUrl, desafioDto, {
      headers: this.getAuthHeaders()
    });
  }

  unirseADesafio(id: number): Observable<any> {
    return this.http.post<any>(`${this.participacionesUrl}/desafio/${id}/unirse`, {}, {
      headers: this.getAuthHeaders()
    });
  }

  verificarParticipacion(desafioId: number): Observable<boolean> {
    return this.http.get<boolean>(
      `${this.participacionesUrl}/desafio/${desafioId}`,
      { headers: this.getAuthHeaders() }
    );
  }

  abandonarDesafio(desafioId: number): Observable<any> {
    return this.http.post(`${this.participacionesUrl}/desafio/${desafioId}/abandonar`, {}, {
      headers: this.getAuthHeaders()
    });
  }
}