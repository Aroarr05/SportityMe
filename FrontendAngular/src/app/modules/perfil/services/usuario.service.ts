import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Usuario } from '../../../shared/models';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  private apiUrl = 'http://localhost:3000/api/usuarios'; 
  
  constructor(private http: HttpClient) { }


  getPerfilUsuario(): Observable<Usuario> {
    return this.http.get<Usuario>(`${this.apiUrl}/perfil`);
  }


  getUsuario(id: number): Observable<Usuario> {
    return this.http.get<Usuario>(`${this.apiUrl}/${id}`);
  }


  updateUsuario(id: number, usuario: Usuario): Observable<Usuario> {
    return this.http.put<Usuario>(`${this.apiUrl}/${id}`, usuario);
  }

  updatePerfil(usuario: Usuario): Observable<Usuario> {
    return this.http.put<Usuario>(`${this.apiUrl}/perfil`, usuario);
  }
}