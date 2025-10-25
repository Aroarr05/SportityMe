import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Usuario } from '../../../shared/models/usuario.model';
import { Desafio } from '../../../shared/models/desafio.model';


@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private apiUrl = `${environment.apiUrl}/admin`;

  constructor(private http: HttpClient) {}

  getUsuarios(): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(`${this.apiUrl}/usuarios`);
  }

  crearUsuario(usuario: Partial<Usuario>): Observable<Usuario> {
    return this.http.post<Usuario>(`${this.apiUrl}/usuarios`, usuario);
  }

  actualizarUsuario(id: number, usuario: Partial<Usuario>): Observable<Usuario> {
    return this.http.put<Usuario>(`${this.apiUrl}/usuarios/${id}`, usuario);
  }

  eliminarUsuario(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/usuarios/${id}`);
  }

  getDesafios(): Observable<Desafio[]> {
    return this.http.get<Desafio[]>(`${this.apiUrl}/desafios`);
  }

  crearDesafio(desafio: Partial<Desafio>): Observable<Desafio> {
    return this.http.post<Desafio>(`${this.apiUrl}/desafios`, desafio);
  }

  actualizarDesafio(id: number, desafio: Partial<Desafio>): Observable<Desafio> {
    return this.http.put<Desafio>(`${this.apiUrl}/desafios/${id}`, desafio);
  }

  eliminarDesafio(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/desafios/${id}`);
  }
}