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
    return this.http.post<Desafio>(this.apiUrl, desafioDto, {
      headers: this.getAuthHeaders()
    });
  }

  actualizarDesafio(id: number, desafio: Partial<Desafio>): Observable<Desafio> {
    return this.http.put<Desafio>(`${this.apiUrl}/${id}`, desafio, {
      headers: this.getAuthHeaders()
    });
  }

  eliminarDesafio(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, {
      headers: this.getAuthHeaders()
    });
  }

  unirseADesafio(id: number): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/${id}/unirse`, {}, {
      headers: this.getAuthHeaders()
    });
  }

  verificarParticipacion(desafioId: number): Observable<boolean> {
    return this.http.get<{ participando: boolean }>(
      `${this.apiUrl}/${desafioId}/participacion`,
      { headers: this.getAuthHeaders() }
    ).pipe(
      map(response => response.participando)
    );
  }

  obtenerParticipantes(desafioId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/${desafioId}/participantes`, {
      headers: this.getAuthHeaders()
    });
  }

  obtenerDesafiosActivos(): Observable<Desafio[]> {
    return this.http.get<Desafio[]>(`${this.apiUrl}/activos`);
  }
 
  abandonarDesafio(desafioId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${desafioId}/participar`, {
      headers: this.getAuthHeaders()
    });
  }
}