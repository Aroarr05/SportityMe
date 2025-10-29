import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
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
    return this.http.get<Progreso[]>(`${this.apiUrl}/usuario`, {
      headers: this.getAuthHeaders() 
    });
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