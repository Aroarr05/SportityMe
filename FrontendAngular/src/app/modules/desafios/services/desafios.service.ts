import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
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

  obtenerDesafios(): Observable<Desafio[]> {
    return this.http.get<Desafio[]>(this.apiUrl);
  }

  obtenerDesafioPorId(id: number): Observable<Desafio> {
    return this.http.get<Desafio>(`${this.apiUrl}/${id}`);
  }

  crearDesafio(desafioDto: CrearDesafioDto): Observable<Desafio> {
    const token = this.authService.getToken();
    
    if (!token) {
      return throwError(() => new Error('No hay token de autenticación'));
    }

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    return this.http.post<Desafio>(this.apiUrl, desafioDto, { headers }).pipe(
      catchError((error) => {
        return throwError(() => error);
      })
    );
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

  obtenerDesafiosDelUsuario(): Observable<Desafio[]> {
    return this.http.get<Desafio[]>(`${this.apiUrl}/usuario/mis-desafios`, {
      headers: this.getAuthHeaders()
    });
  }

  obtenerDesafiosParticipando(): Observable<Desafio[]> {
    return this.http.get<Desafio[]>(`${this.apiUrl}/usuario/participando`, {
      headers: this.getAuthHeaders()
    });
  }

  actualizarDesafio(id: number, desafioDto: Partial<CrearDesafioDto>): Observable<Desafio> {
    return this.http.put<Desafio>(`${this.apiUrl}/${id}`, desafioDto, {
      headers: this.getAuthHeaders()
    });
  }

  eliminarDesafio(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, {
      headers: this.getAuthHeaders()
    });
  }

  buscarDesafios(termino: string): Observable<Desafio[]> {
    return this.http.get<Desafio[]>(`${this.apiUrl}/buscar`, {
      params: { q: termino }
    });
  }

  obtenerDesafiosPorTipo(tipo: string): Observable<Desafio[]> {
    return this.http.get<Desafio[]>(`${this.apiUrl}/tipo/${tipo}`);
  }

  obtenerEstadisticasDesafio(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}/estadisticas`, {
      headers: this.getAuthHeaders()
    });
  }

  finalizarDesafio(id: number): Observable<Desafio> {
    return this.http.post<Desafio>(`${this.apiUrl}/${id}/finalizar`, {}, {
      headers: this.getAuthHeaders()
    });
  }
}