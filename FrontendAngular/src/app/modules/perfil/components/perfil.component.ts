import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UsuarioService } from '../services/usuario.service';
import { AuthService } from '../../../auth/services/auth.service';
import { Usuario, Genero } from '../../../shared/models';

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
  error: string = '';

  generos = Object.values(Genero);

  constructor(
    private usuarioService: UsuarioService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.cargarUsuario();
  }

  cargarUsuario(): void {
    this.cargando = true;
    this.error = '';
    
    this.authService.getProfile().subscribe({
      next: (usuarioData: any) => {
        console.log('Perfil cargado desde backend:', usuarioData);
        this.usuario = this.mapearUsuarioDesdeBackend(usuarioData);
        this.usuarioEditado = { ...this.usuario };
        this.cargando = false;
        console.log('Usuario mapeado:', this.usuario);
      },
      error: (error) => {
        console.error('Error al cargar perfil:', error);
        this.cargarUsuarioDesdeAuth();
      }
    });
  }

  private mapearUsuarioDesdeBackend(usuarioBackend: any): Usuario {
    console.log('Mapeando usuario desde backend:', usuarioBackend);
    console.log('Campos disponibles en backend:', Object.keys(usuarioBackend));
    
    const usuario: Usuario = {
      id: usuarioBackend.id,
      nombre: usuarioBackend.nombre,
      email: usuarioBackend.email,
      contraseña: '',
      rol_id: usuarioBackend.rol_id || 2,
      
      avatar_url: usuarioBackend.avatar_url || usuarioBackend.avatarUrl || undefined,
      biografia: usuarioBackend.biografia || undefined,
      ubicacion: usuarioBackend.ubicacion || undefined,
      fecha_nacimiento: usuarioBackend.fecha_nacimiento || undefined,
      genero: usuarioBackend.genero as 'MASCULINO' | 'FEMENINO' | 'OTRO' | 'NO_ESPECIFICADO' || undefined,
      peso: usuarioBackend.peso !== undefined && usuarioBackend.peso !== null ? Number(usuarioBackend.peso) : undefined,
      altura: usuarioBackend.altura !== undefined && usuarioBackend.altura !== null ? Number(usuarioBackend.altura) : undefined,
      fecha_registro: usuarioBackend.fecha_registro || usuarioBackend.fechaRegistro,
      ultimo_login: usuarioBackend.ultimo_login || undefined,
      activo: usuarioBackend.activo !== undefined ? usuarioBackend.activo : true
    };

    console.log('Usuario después del mapeo:', usuario);
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

    if (usuarioFrontend.peso !== undefined) {
      payload.peso = Number(usuarioFrontend.peso);
    }
    if (usuarioFrontend.altura !== undefined) {
      payload.altura = Number(usuarioFrontend.altura);
    }

    console.log('Payload para backend:', payload);
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
      this.usuarioEditado = this.usuario ? { ...this.usuario } : {};
    } else {
      this.usuarioEditado = this.usuario ? { ...this.usuario } : {};
    }
    this.editando = !this.editando;
  }

  guardarCambios(): void {
    if (!this.usuarioEditado?.id) {
      this.error = 'No se puede guardar: datos incompletos';
      return;
    }

    this.cargando = true;
    
    const usuarioParaBackend = this.mapearUsuarioParaBackend(this.usuarioEditado);
    console.log('Enviando datos al backend:', usuarioParaBackend);
    
    this.authService.updateProfile(usuarioParaBackend).subscribe({
      next: (usuarioActualizado: any) => {
        console.log('Perfil actualizado desde backend:', usuarioActualizado);
        this.usuario = this.mapearUsuarioDesdeBackend(usuarioActualizado);
        this.usuarioEditado = { ...this.usuario };
        this.editando = false;
        this.cargando = false;
        this.error = '';
      },
      error: (error) => {
        this.error = 'Error al actualizar el perfil: ' + (error.error?.message || error.message);
        this.cargando = false;
        console.error('Error al actualizar:', error);
      }
    });
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
      return new Date(fecha).toLocaleDateString('es-ES');
    } catch (e) {
      return 'Fecha inválida';
    }
  }

  onFileSelected(event: any): void {
    const file: File = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.usuarioEditado.avatar_url = e.target.result as string;
      };
      reader.readAsDataURL(file);
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
    
    switch (genero) {
      case 'MASCULINO': return 'Masculino';
      case 'FEMENINO': return 'Femenino';
      case 'OTRO': return 'Otro';
      case 'NO_ESPECIFICADO': return 'No especificado';
      default: return genero;
    }
  }

  getPesoDisplay(): string {
    const peso = this.usuario?.peso;
    return peso !== undefined ? `${peso} kg` : 'No especificado';
  }

  getAlturaDisplay(): string {
    const altura = this.usuario?.altura;
    return altura !== undefined ? `${altura} cm` : 'No especificado';
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

  getAvatarUrl(): string {
    return this.usuario?.avatar_url || 'https://via.placeholder.com/150';
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
}