import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, throwError, tap } from 'rxjs';
import { Desafio } from '../../../../shared/models';

@Injectable({
  providedIn: 'root'
})
export class DesafiosService {
  private apiUrl = 'http://localhost:8080/api/desafios';

  constructor(private http: HttpClient) { }

  obtenerDesafios(): Observable<Desafio[]> {
    return this.http.get<Desafio[]>(this.apiUrl).pipe(
      tap(data => console.log('Respuesta cruda del servidor:', data)),
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse) {
    console.error('Error en servicio Desafios:', error);
    
    let errorMessage = 'Error desconocido';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Error: ${error.error.message}`;
    } else {
      errorMessage = `Error ${error.status}: ${error.message}`;
      if (error.error && error.error.error) {
        errorMessage += ` - ${error.error.error}`;
      }
    }
    return throwError(() => new Error(errorMessage));
  }
}