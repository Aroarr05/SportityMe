import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { Progreso, CrearProgresoDto } from '../../../shared/models/progreso.model';
import { AuthService } from '../../../auth/services/auth.service';

@Injectable({
  providedIn: 'root'
})

export class ProgresosService {
  private apiUrl = `${environment.apiUrl}/progresos`;

  constructor(
    private http: HttpClient,
    private authService: AuthService 
  ) { }

  private getAuthHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  obtenerMiHistorial(): Observable<Progreso[]> {
    const token = this.authService.getToken();
    
    if (!token) {
      return throwError(() => new Error('No hay token de autenticación'));
    }

    const headers = this.getAuthHeaders();

    return this.http.get<Progreso[]>(`${this.apiUrl}/usuario`, {
      headers: headers
    }).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 403) {
          const currentUser = this.authService.getCurrentUser();
          const hasToken = !!this.authService.getToken();
          if (hasToken && !currentUser) {
            this.authService.logout();
          }
        }
        return throwError(() => error);
      })
    );
  }

  registrarProgreso(progresoDto: CrearProgresoDto): Observable<Progreso> {
    return this.http.post<Progreso>(this.apiUrl, progresoDto, {
      headers: this.getAuthHeaders() 
    });
  }

  obtenerProgresosDesafio(desafioId: number): Observable<Progreso[]> {
    return this.http.get<Progreso[]>(`${this.apiUrl}/desafio/${desafioId}`, {
      headers: this.getAuthHeaders() 
    });
  }

  obtenerProgresoActualDesafio(desafioId: number): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/desafio/${desafioId}/total`, { 
      headers: this.getAuthHeaders()
    });
  }

  eliminarProgreso(progresoId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${progresoId}`, {
      headers: this.getAuthHeaders() 
    });
  }

  actualizarProgreso(progresoId: number, progresoDto: CrearProgresoDto): Observable<Progreso> {
    return this.http.put<Progreso>(`${this.apiUrl}/${progresoId}`, progresoDto, {
      headers: this.getAuthHeaders() 
    });
  }
}