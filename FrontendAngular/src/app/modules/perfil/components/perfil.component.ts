import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UsuarioService } from '../services/usuario.service';
import { AuthService } from '../../../auth/services/auth.service';
import { Usuario, Genero } from '../../../shared/models';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class PerfilComponent implements OnInit {
  usuario: Usuario | null = null;
  editando: boolean = false;
  usuarioEditado: Partial<Usuario> = {};
  cargando: boolean = true;
  subiendoImagen: boolean = false;
  error: string = '';
  mensajeExito: string = '';
  archivoSeleccionado: File | null = null;
  previewImagen: string | null = null;

  generos = [
    { value: 'MASCULINO', label: 'Masculino' },
    { value: 'FEMENINO', label: 'Femenino' },
    { value: 'OTRO', label: 'Otro' },
    { value: 'NO_ESPECIFICADO', label: 'No especificado' }
  ];

  constructor(
    private usuarioService: UsuarioService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.cargarUsuario();
  }

  cargarUsuario(): void {
    this.cargando = true;
    this.error = '';
    this.mensajeExito = '';

    this.authService.getProfile().subscribe({
      next: (usuarioData: any) => {
        this.usuario = this.mapearUsuarioDesdeBackend(usuarioData);
        this.usuarioEditado = { ...this.usuario };
        this.cargando = false;
      },
      error: (error) => {
        this.cargarUsuarioDesdeAuth();
      }
    });
  }

  private mapearUsuarioDesdeBackend(usuarioBackend: any): Usuario {
    let avatarPath = usuarioBackend.avatar_url;

    const usuario: Usuario = {
      id: usuarioBackend.id,
      nombre: usuarioBackend.nombre,
      email: usuarioBackend.email,
      contraseña: '',
      rol_id: usuarioBackend.rol_id || 2,
      avatar_url: avatarPath,
      biografia: usuarioBackend.biografia || '',
      ubicacion: usuarioBackend.ubicacion || '',
      fecha_nacimiento: usuarioBackend.fecha_nacimiento || '',
      genero: (usuarioBackend.genero as Genero) || undefined,
      peso: usuarioBackend.peso !== undefined && usuarioBackend.peso !== null ? Number(usuarioBackend.peso) : undefined,
      altura: usuarioBackend.altura !== undefined && usuarioBackend.altura !== null ? Number(usuarioBackend.altura) : undefined,
      fecha_registro: usuarioBackend.fecha_registro || usuarioBackend.fechaRegistro || '',
      ultimo_login: usuarioBackend.ultimo_login || '',
      activo: usuarioBackend.activo !== undefined ? usuarioBackend.activo : true
    };

    return usuario;
  }

  private mapearUsuarioParaBackend(usuarioFrontend: Partial<Usuario>): any {
    const payload: any = {
      id: usuarioFrontend.id,
      nombre: usuarioFrontend.nombre,
      email: usuarioFrontend.email,
      biografia: usuarioFrontend.biografia,
      ubicacion: usuarioFrontend.ubicacion,
      fecha_nacimiento: usuarioFrontend.fecha_nacimiento,
      genero: usuarioFrontend.genero,
      avatar_url: usuarioFrontend.avatar_url
    };

    if (usuarioFrontend.peso !== undefined && usuarioFrontend.peso !== null) {
      const pesoNum = Number(usuarioFrontend.peso);
      if (!isNaN(pesoNum)) {
        payload.peso = pesoNum;
      }
    }

    if (usuarioFrontend.altura !== undefined && usuarioFrontend.altura !== null) {
      const alturaNum = Number(usuarioFrontend.altura);
      if (!isNaN(alturaNum)) {
        payload.altura = alturaNum;
      }
    }

    return payload;
  }

  private cargarUsuarioDesdeAuth(): void {
    const usuarioAuth = this.authService.getCurrentUser();
    if (usuarioAuth) {
      this.usuario = this.mapearUsuarioDesdeBackend(usuarioAuth);
      this.usuarioEditado = { ...this.usuario };
      this.cargando = false;
    } else {
      this.error = 'No se pudo cargar el perfil del usuario';
      this.cargando = false;
    }
  }

  toggleEdicion(): void {
    if (this.editando) {
      this.cancelarEdicion();
    } else {
      this.editando = true;
      this.usuarioEditado = this.usuario ? { ...this.usuario } : {};
    }
  }

  guardarCambios(): void {
    if (!this.usuarioEditado?.id) {
      this.error = 'No se puede guardar: datos incompletos';
      return;
    }

    this.cargando = true;
    this.error = '';
    this.mensajeExito = '';

    if (this.archivoSeleccionado && this.usuario) {
      this.subiendoImagen = true;

      const validacion = this.usuarioService.validateImageFile(this.archivoSeleccionado);
      if (!validacion.valid) {
        this.error = validacion.error || 'Archivo inválido';
        this.cargando = false;
        this.subiendoImagen = false;
        return;
      }

      this.guardarImagenYActualizarPerfil();
    } else {
      this.guardarDatosUsuario();
    }
  }

  private guardarImagenYActualizarPerfil(): void {
    if (!this.archivoSeleccionado || !this.usuario) return;

    const timestamp = new Date().getTime();
    const extension = this.archivoSeleccionado.name.split('.').pop() || 'jpg';
    const nombreArchivo = `avatar_${this.usuario.id}_${timestamp}.${extension}`;
    const rutaLocal = `/assets/avatars/${nombreArchivo}`;

    this.guardarImagenLocalmente(nombreArchivo).then(() => {
      this.usuarioEditado.avatar_url = rutaLocal;
      this.guardarDatosUsuario();
    }).catch(error => {
      this.error = 'Error al guardar la imagen: ' + error;
      this.cargando = false;
      this.subiendoImagen = false;
    });
  }

  private guardarImagenLocalmente(nombreArchivo: string): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.archivoSeleccionado) {
        reject('No hay archivo seleccionado');
        return;
      }

      const reader = new FileReader();
      reader.onload = (e: any) => {
        const base64Data = e.target.result.split(',')[1];

        try {
          localStorage.setItem(`avatar_${nombreArchivo}`, base64Data);
          resolve();
        } catch (error) {
          reject('Error al guardar en localStorage: ' + error);
        }
      };

      reader.onerror = () => {
        reject('Error al leer el archivo');
      };

      reader.readAsDataURL(this.archivoSeleccionado);
    });
  }

  private guardarDatosUsuario(): void {
    const usuarioParaBackend = this.mapearUsuarioParaBackend(this.usuarioEditado);

    this.authService.updateProfile(usuarioParaBackend).pipe(
      finalize(() => {
        this.cargando = false;
        this.subiendoImagen = false;
      })
    ).subscribe({
      next: (usuarioActualizado: any) => {
        this.usuario = this.mapearUsuarioDesdeBackend(usuarioActualizado);
        this.usuarioEditado = { ...this.usuario };
        this.editando = false;
        this.archivoSeleccionado = null;
        this.previewImagen = null;
        this.mensajeExito = 'Perfil actualizado correctamente';

        this.authService.setCurrentUser(usuarioActualizado);

        setTimeout(() => {
          this.mensajeExito = '';
        }, 5000);
      },
      error: (error) => {
        this.error = 'Error al actualizar el perfil: ' + (error.error?.message || error.message);
      }
    });
  }

  onFileSelected(event: any): void {
    const file: File = event.target.files[0];
    if (file) {
      const validacion = this.usuarioService.validateImageFile(file);
      if (!validacion.valid) {
        this.error = validacion.error || 'Archivo inválido';
        return;
      }

      this.archivoSeleccionado = file;

      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.previewImagen = e.target.result;
        this.error = '';
      };
      reader.onerror = () => {
        this.error = 'Error al leer el archivo de imagen';
      };
      reader.readAsDataURL(file);
    }
  }

  calcularEdad(fechaNacimiento: string | undefined): number {
    if (!fechaNacimiento) return 0;

    try {
      const hoy = new Date();
      const nacimiento = new Date(fechaNacimiento);
      let edad = hoy.getFullYear() - nacimiento.getFullYear();
      const mes = hoy.getMonth() - nacimiento.getMonth();

      if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) {
        edad--;
      }

      return edad;
    } catch (e) {
      return 0;
    }
  }

  formatearFecha(fecha: string | undefined): string {
    if (!fecha) return 'No especificada';
    try {
      return new Date(fecha).toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (e) {
      return 'Fecha inválida';
    }
  }

  getFechaNacimientoDisplay(): string {
    if (!this.usuario?.fecha_nacimiento) return 'No especificada';
    const edad = this.calcularEdad(this.usuario.fecha_nacimiento);
    return `${this.formatearFecha(this.usuario.fecha_nacimiento)} (${edad} años)`;
  }

  getGeneroDisplay(): string {
    const genero = this.usuario?.genero;
    if (!genero) return 'No especificado';

    const generoObj = this.generos.find(g => g.value === genero);
    return generoObj ? generoObj.label : genero;
  }

  getPesoDisplay(): string {
    const peso = this.usuario?.peso;
    return peso !== undefined && peso !== null ? `${peso} kg` : 'No especificado';
  }

  getAlturaDisplay(): string {
    const altura = this.usuario?.altura;
    return altura !== undefined && altura !== null ? `${altura} cm` : 'No especificado';
  }

  getNombre(): string {
    return this.usuario?.nombre || 'Usuario';
  }

  getEmail(): string {
    return this.usuario?.email || '';
  }

  getBiografia(): string {
    return this.usuario?.biografia || 'Sin biografía';
  }

  getUbicacion(): string {
    return this.usuario?.ubicacion || 'No especificada';
  }

  getAvatarUrl(): string | null {
    if (this.previewImagen && this.editando) {
      return this.previewImagen;
    }

    if (this.usuario?.avatar_url) {
      const url = this.usuario.avatar_url;

      if (url.startsWith('http')) {
        return url;
      } else if (url.startsWith('/assets/avatars/')) {
        const nombreArchivo = url.split('/').pop();
        if (nombreArchivo) {
          const base64Data = localStorage.getItem(`avatar_${nombreArchivo}`);
          if (base64Data) {
            return `data:image/jpeg;base64,${base64Data}`;
          }
        }
      }
      return url;
    }

    return null;
  }

  getRolId(): number {
    return this.usuario?.rol_id || 2;
  }

  getFechaRegistro(): string {
    return this.usuario?.fecha_registro || '';
  }

  getUltimoLogin(): string {
    return this.usuario?.ultimo_login || '';
  }

  getActivo(): boolean {
    return this.usuario?.activo !== undefined ? this.usuario.activo : true;
  }

  cancelarEdicion(): void {
    this.editando = false;
    this.usuarioEditado = this.usuario ? { ...this.usuario } : {};
    this.archivoSeleccionado = null;
    this.previewImagen = null;
    this.error = '';
    this.mensajeExito = '';
  }

  getIniciales(nombre: string | undefined): string {
    if (!nombre) return 'U';
    const partes = nombre.trim().split(' ');
    if (partes.length === 1) {
      return partes[0].charAt(0).toUpperCase();
    }
    return (partes[0].charAt(0) + partes[1].charAt(0)).toUpperCase();
  }

  limpiarLocalStorageCompleto(): void {
    if (confirm('¿Estás seguro de que quieres limpiar todo el localStorage? Esto eliminará todos los avatars guardados.')) {
      try {
        const avatarKeys = [];
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (key && key.startsWith('avatar_')) {
            avatarKeys.push(key);
          }
        }

        localStorage.clear();

        this.mensajeExito = `Se limpió el localStorage (${avatarKeys.length} avatars eliminados)`;

        setTimeout(() => {
          location.reload();
        }, 2000);

      } catch (error) {
        this.error = 'Error al limpiar localStorage: ' + error;
      }
    }
  }

}