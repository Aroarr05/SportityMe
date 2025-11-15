import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap, map } from 'rxjs/operators';
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
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  getDesafios(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/desafios`, { 
      headers: this.getAuthHeaders() 
    }).pipe(
      catchError(this.handleError.bind(this))
    );
  }

  crearDesafio(desafio: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/desafios`, desafio, { 
      headers: this.getAuthHeaders() 
    }).pipe(
      catchError(this.handleError.bind(this))
    );
  }

  actualizarDesafio(id: number, desafio: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/desafios/${id}`, desafio, { 
      headers: this.getAuthHeaders() 
    }).pipe(
      catchError(this.handleError.bind(this))
    );
  }

  eliminarDesafio(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/desafios/${id}`, { 
      headers: this.getAuthHeaders() 
    }).pipe(
      catchError(this.handleError.bind(this))
    );
  }

  getUsuarios(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/usuarios`, { 
      headers: this.getAuthHeaders() 
    }).pipe(
      catchError(this.handleError.bind(this))
    );
  }

  crearUsuario(usuario: any): Observable<any> {
    console.log('URL completa:', `${this.apiUrl}/usuarios`);
    console.log('Datos enviados:', usuario);
    
    return this.http.post<any>(`${this.apiUrl}/usuarios`, usuario, { 
      headers: this.getAuthHeaders() 
    }).pipe(
      tap((response) => {
        console.log('Respuesta del servidor:', response);
      }),
      catchError((error: HttpErrorResponse) => {
        console.error('Error en crearUsuario:', error);
        return this.handleError(error);
      })
    );
  }

  actualizarUsuario(id: number, usuario: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/usuarios/${id}`, usuario, { 
      headers: this.getAuthHeaders() 
    }).pipe(
      catchError(this.handleError.bind(this))
    );
  }

  eliminarUsuario(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/usuarios/${id}`, { 
      headers: this.getAuthHeaders() 
    }).pipe(
      catchError(this.handleError.bind(this))
    );
  }

  private handleError(error: HttpErrorResponse) {
    console.error('Error en AdminService:', error);
    
    let errorMessage = 'Error desconocido';
    
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Error: ${error.error.message}`;
    } else {
      if (error.error && error.error.error) {
        errorMessage = error.error.error;
      } else if (error.status === 400) {
        errorMessage = 'Error en los datos enviados';
      } else if (error.status === 403) {
        errorMessage = 'No tienes permisos de administrador';
      } else if (error.status === 401) {
        errorMessage = 'No estás autenticado';
      } else if (error.status === 404) {
        errorMessage = 'Endpoint no encontrado';
      } else {
        errorMessage = `Error ${error.status}: ${error.message}`;
      }
    }
    
    return throwError(() => new Error(errorMessage));
  }
}