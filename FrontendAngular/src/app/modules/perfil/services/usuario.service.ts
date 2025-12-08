import { Injectable } from '@angular/core';
import { HttpClient, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Usuario } from '../../../shared/models';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  private apiUrl = 'http://localhost:3000/api/usuarios';
  private uploadUrl = 'http://localhost:3000/api/upload';

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

  uploadAvatar(file: File, userId: number): Observable<any> {

    console.log('Simulando subida de avatar...');

    return new Observable(observer => {
      setTimeout(() => {
        const timestamp = new Date().getTime();
        const extension = file.name.split('.').pop();
        const nombreArchivo = `avatar_${userId}_${timestamp}.${extension}`;

        observer.next({
          type: 2,
          body: {
            success: true,
            path: `/assets/avatars/${nombreArchivo}`,
            fileName: nombreArchivo
          }
        });
        observer.complete();
      }, 1500);
    });
  }

  validateImageFile(file: File): { valid: boolean; error?: string } {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
    const maxSize = 5 * 1024 * 1024; // 5MB

    if (!allowedTypes.includes(file.type)) {
      return { valid: false, error: 'Formato no permitido' };
    }

    if (file.size > maxSize) {
      return { valid: false, error: 'Archivo demasiado grande' };
    }

    return { valid: true };
  }
}