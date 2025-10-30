import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
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
    const user = this.authService.getCurrentUser();
    
    console.log('🔍 DEBUG obtenerMiHistorial:');
    console.log('🔑 Token:', token ? 'PRESENTE' : 'AUSENTE');
    console.log('👤 Usuario actual:', user);
    console.log('📡 URL:', `${this.apiUrl}/usuario`);
    
    if (!token) {
      console.error('❌ ERROR: No hay token disponible');
      return throwError(() => new Error('No hay token de autenticación'));
    }

    const headers = this.getAuthHeaders();
    console.log('📨 Headers enviados:', headers.keys());

    return this.http.get<Progreso[]>(`${this.apiUrl}/usuario`, {
      headers: headers
    }).pipe(
      tap(response => {
        console.log('✅ Respuesta exitosa:', response);
      }),
      catchError((error: HttpErrorResponse) => {
        console.error('❌ Error en HTTP request:', error);
        console.error('🔍 Error details:', {
          status: error.status,
          statusText: error.statusText,
          url: error.url,
          headers: error.headers
        });
        
        if (error.status === 403) {
          console.warn('⚠️ Error 403 - Verificando estado de autenticación...');
          const currentUser = this.authService.getCurrentUser();
          const hasToken = !!this.authService.getToken();
          console.log('🔐 Estado actual - Usuario:', currentUser, 'Token:', hasToken);
   
          if (hasToken && !currentUser) {
            console.warn('🔄 Token presente pero usuario no cargado - Forzando logout');
            this.authService.logout();
          }
        }
        
        return throwError(() => error);
      })
    );
  }

  obtenerResumenProgresos(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/usuario`, { 
      headers: this.getAuthHeaders()
    });
  }

  obtenerProgresosPorDesafio(): Observable<Progreso[]> {
    return this.http.get<Progreso[]>(`${this.apiUrl}/usuario`, { 
      headers: this.getAuthHeaders()
    });
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