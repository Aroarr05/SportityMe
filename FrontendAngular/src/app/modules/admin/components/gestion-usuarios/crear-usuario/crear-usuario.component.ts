import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminService } from '../../../services/admin.service';

@Component({
  selector: 'app-crear-usuario',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './crear-usuario.component.html'
})

export class CrearUsuarioComponent {
  @Output() creado = new EventEmitter<void>();
  @Output() cancelar = new EventEmitter<void>();

  usuario: any = {};
  guardando = false;
  mensajeError = '';
  mensajeExito = '';

  generos = [
    { valor: 'masculino', texto: 'Masculino' },
    { valor: 'femenino', texto: 'Femenino' },
    { valor: 'otro', texto: 'Otro' },
    { valor: 'no_especificado', texto: 'No especificado' }
  ];

  constructor(private adminService: AdminService) {}

  ngOnInit() {
    this.usuario = {
      activo: true,
      genero: 'no_especificado'
    };
  }

  guardar(): void {
    if (!this.validarFormulario()) {
      return;
    }

    this.guardando = true;
    this.mensajeError = '';
    this.mensajeExito = '';

    const usuarioParaBackend = {
      nombre: this.usuario.nombre?.trim(),
      email: this.usuario.email?.trim().toLowerCase(),
      contraseña: this.usuario.password,
      rol_id: 2, 
      activo: Boolean(this.usuario.activo),
      genero: this.usuario.genero || 'no_especificado',

      ...(this.usuario.fecha_nacimiento && { fecha_nacimiento: this.usuario.fecha_nacimiento }),
      ...(this.usuario.peso && { peso: Number(this.usuario.peso) }),
      ...(this.usuario.altura && { altura: Number(this.usuario.altura) }),
      ...(this.usuario.ubicacion?.trim() && { ubicacion: this.usuario.ubicacion.trim() }),
      ...(this.usuario.avatar_url?.trim() && { avatar_url: this.usuario.avatar_url.trim() }),
      ...(this.usuario.biografia?.trim() && { biografia: this.usuario.biografia.trim() })
    };

    console.log('📤 Enviando datos al backend:', usuarioParaBackend);

    this.adminService.crearUsuario(usuarioParaBackend).subscribe({
      next: (response) => {
        console.log(' Usuario creado exitosamente:', response);
        this.guardando = false;
        this.mensajeExito = 'Usuario creado exitosamente';
        this.creado.emit();
        this.limpiarFormulario();
        
    
        setTimeout(() => {
          this.mensajeExito = '';
        }, 3000);
      },
      error: (error) => {
        console.error('Error creando usuario:', error);
        this.mensajeError = this.obtenerMensajeError(error);
        this.guardando = false;
      }
    });
  }

  private obtenerMensajeError(error: any): string {
    if (error.message && error.message.includes('El email ya está registrado')) {
      return 'El email ya está registrado. Por favor, use un email diferente.';
    }
    
    if (error.message && error.message.includes('Formato de email inválido')) {
      return 'El formato del email no es válido. Use un email válido como: usuario@dominio.com';
    }
    
    if (error.message && error.message.includes('rol_id cannot be null')) {
      return 'Error interno del sistema. Por favor, contacte al administrador.';
    }

    if (error.error && error.error.error) {
      return error.error.error;
    }
    if (error.message) {
      return error.message;
    }
    return 'Error al crear el usuario';
  }

  private validarFormulario(): boolean {
    this.mensajeError = '';

    if (!this.usuario.nombre?.trim()) {
      this.mensajeError = 'El nombre es requerido';
      return false;
    }

    if (this.usuario.nombre.trim().length < 2) {
      this.mensajeError = 'El nombre debe tener al menos 2 caracteres';
      return false;
    }

    if (!this.usuario.email?.trim()) {
      this.mensajeError = 'El email es requerido';
      return false;
    }

    const email = this.usuario.email.trim().toLowerCase();
    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    
    if (!emailRegex.test(email)) {
      this.mensajeError = 'El formato del email no es válido. Ejemplo: usuario@dominio.com';
      return false;
    }

    if (email.includes(' ')) {
      this.mensajeError = 'El email no puede contener espacios';
      return false;
    }

    if (!this.usuario.password) {
      this.mensajeError = 'La contraseña es requerida';
      return false;
    }

    if (this.usuario.password.length < 6) {
      this.mensajeError = 'La contraseña debe tener al menos 6 caracteres';
      return false;
    }

    if (this.usuario.peso) {
      const peso = Number(this.usuario.peso);
      if (isNaN(peso) || peso < 0 || peso > 500) {
        this.mensajeError = 'El peso debe ser un número entre 0 y 500 kg';
        return false;
      }
    }


    if (this.usuario.altura) {
      const altura = Number(this.usuario.altura);
      if (isNaN(altura) || altura < 0 || altura > 300) {
        this.mensajeError = 'La altura debe ser un número entre 0 y 300 cm';
        return false;
      }
    }

    return true;
  }

  onEmailInput(event: any): void {
    let email = event.target.value;
    email = email.replace(/\s/g, '').toLowerCase();
    this.usuario.email = email;
  }

  private limpiarFormulario(): void {
    this.usuario = {
      activo: true,
      genero: 'no_especificado'
    };
  }

  onCancelar(): void {
    this.cancelar.emit();
  }
}