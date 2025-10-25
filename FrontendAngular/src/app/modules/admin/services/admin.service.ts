import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { AuthService } from '../../../auth/services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private apiUrl = `${environment.apiUrl}/admin`;

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  private getAuthHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    console.log('🔐 Token enviado a admin:', token ? 'Presente' : 'Ausente');
    
    if (!token) {
      console.error('❌ No hay token disponible');
    }

    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  getDesafios(): Observable<any[]> {
    console.log('📋 Obteniendo desafíos desde admin...');
    return this.http.get<any[]>(`${this.apiUrl}/desafios`, { 
      headers: this.getAuthHeaders() 
    }).pipe(
      catchError(this.handleError)
    );
  }

  crearDesafio(desafio: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/desafios`, desafio, { 
      headers: this.getAuthHeaders() 
    }).pipe(
      catchError(this.handleError)
    );
  }

  actualizarDesafio(id: number, desafio: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/desafios/${id}`, desafio, { 
      headers: this.getAuthHeaders() 
    }).pipe(
      catchError(this.handleError)
    );
  }

  eliminarDesafio(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/desafios/${id}`, { 
      headers: this.getAuthHeaders() 
    }).pipe(
      catchError(this.handleError)
    );
  }

  getUsuarios(): Observable<any[]> {
    console.log('👥 Obteniendo usuarios desde admin...');
    return this.http.get<any[]>(`${this.apiUrl}/usuarios`, { 
      headers: this.getAuthHeaders() 
    }).pipe(
      catchError(this.handleError)
    );
  }

  crearUsuario(usuario: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/usuarios`, usuario, { 
      headers: this.getAuthHeaders() 
    }).pipe(
      catchError(this.handleError)
    );
  }

  actualizarUsuario(id: number, usuario: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/usuarios/${id}`, usuario, { 
      headers: this.getAuthHeaders() 
    }).pipe(
      catchError(this.handleError)
    );
  }

  eliminarUsuario(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/usuarios/${id}`, { 
      headers: this.getAuthHeaders() 
    }).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse) {
    console.error('❌ Error en AdminService:', error);
    
    let errorMessage = 'Error desconocido';
    if (error.error instanceof ErrorEvent) {

      errorMessage = `Error: ${error.error.message}`;
    } else {

      errorMessage = `Código: ${error.status}\nMensaje: ${error.message}`;
      
      if (error.status === 403) {
        errorMessage = 'No tienes permisos de administrador para acceder a esta función';
      } else if (error.status === 401) {
        errorMessage = 'No estás autenticado. Por favor, inicia sesión nuevamente';
      } else if (error.status === 404) {
        errorMessage = 'Recurso no encontrado';
      }
    }
    
    return throwError(() => new Error(errorMessage));
  }
}