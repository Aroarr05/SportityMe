import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { AuthService } from '../../../auth/services/auth.service';

@Injectable({
  providedIn: 'root'
})

export class ProgresosService {
  apiUrl = `${environment.apiUrl}/progresos`;

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

  obtenerMiHistorial(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/usuario`, {
      headers: this.getAuthHeaders()
    });
  }

  actualizarProgreso(progresoId: number, datos: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${progresoId}`, datos, {
      headers: this.getAuthHeaders()
    });
  }

  eliminarProgreso(progresoId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${progresoId}`, {
      headers: this.getAuthHeaders()
    });
  }
}