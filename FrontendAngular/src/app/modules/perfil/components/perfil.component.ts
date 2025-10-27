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
  usuarioEditado: Usuario;
  cargando: boolean = true;
  error: string = '';

  generos = Object.values(Genero);

  private usuarioVacio: Usuario = {
    id: 0,
    nombre: '',
    email: '',
    contraseña: '',
    rol_id: 2,
    avatar_url: '',
    biografia: '',
    ubicacion: '',
    fecha_nacimiento: '',
    genero: undefined,
    peso: 0,
    altura: 0,
    fecha_registro: new Date().toISOString(),
    ultimo_login: '',
    activo: false
  };

  constructor(
    private usuarioService: UsuarioService,
    private authService: AuthService
  ) {
    this.usuarioEditado = { ...this.usuarioVacio };
  }

  ngOnInit(): void {
    this.cargarUsuario();
  }

  cargarUsuario(): void {
    this.cargando = true;
    
    this.authService.getProfile().subscribe({
      next: (usuario) => {
        this.usuario = usuario;
        this.usuarioEditado = { ...usuario };
        this.cargando = false;
        console.log('Perfil cargado desde AuthService:', usuario);
      },
      error: (error) => {
        console.error('Error al cargar perfil:', error);
        this.cargarUsuarioDesdeAuth();
      }
    });
  }

  private cargarUsuarioDesdeAuth(): void {
    const usuarioAuth = this.authService.getCurrentUser();
    if (usuarioAuth) {
      this.usuario = usuarioAuth;
      this.usuarioEditado = { ...usuarioAuth };
      this.cargando = false;
      console.log('Perfil cargado desde usuario actual:', usuarioAuth);
    } else {
      this.error = 'No se pudo cargar el perfil del usuario';
      this.cargando = false;
    }
  }

  toggleEdicion(): void {
    if (this.editando) {
      this.usuarioEditado = this.usuario ? { ...this.usuario } : { ...this.usuarioVacio };
    }
    this.editando = !this.editando;
  }

  guardarCambios(): void {
    if (!this.usuarioEditado.id) {
      this.error = 'No se puede guardar: datos incompletos';
      return;
    }

    this.cargando = true;
    
    this.authService.updateProfile(this.usuarioEditado).subscribe({
      next: (usuarioActualizado) => {
        this.usuario = usuarioActualizado;
        this.usuarioEditado = { ...usuarioActualizado };
        this.editando = false;
        this.cargando = false;
        this.error = '';
        
        console.log('Perfil actualizado correctamente:', usuarioActualizado);
      },
      error: (error) => {
        this.error = 'Error al actualizar el perfil';
        this.cargando = false;
        console.error('Error al actualizar:', error);
      }
    });
  }

  calcularEdad(fechaNacimiento: string | undefined): number {
    if (!fechaNacimiento) return 0;
    
    const hoy = new Date();
    const nacimiento = new Date(fechaNacimiento);
    let edad = hoy.getFullYear() - nacimiento.getFullYear();
    const mes = hoy.getMonth() - nacimiento.getMonth();
    
    if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) {
      edad--;
    }
    
    return edad;
  }

  formatearFecha(fecha: string | undefined): string {
    if (!fecha) return 'No especificada';
    return new Date(fecha).toLocaleDateString('es-ES');
  }

  onFileSelected(event: any): void {
    const file: File = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.usuarioEditado.avatar_url = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  getFechaNacimientoDisplay(): string {
    if (!this.usuario?.fecha_nacimiento) return 'No especificada';
    return `${this.formatearFecha(this.usuario.fecha_nacimiento)} (${this.calcularEdad(this.usuario.fecha_nacimiento)} años)`;
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

  getGenero(): string {
    return this.usuario?.genero || 'No especificado';
  }

  getPeso(): string | number {
    return this.usuario?.peso || 'No especificado';
  }

  getAltura(): string | number {
    return this.usuario?.altura || 'No especificado';
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
    return this.usuario?.activo || false;
  }
}