import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { DesafiosService } from '../../services/desafios.service';
import { AuthService } from '../../../../auth/services/auth.service';
import { TipoActividad, Dificultad } from '../../../../shared/models';
import { ErrorAlertComponent } from '../../../../shared/components/error-alert/error-alert.component';

@Component({
  standalone: true,
  selector: 'app-crear-desafio',
  templateUrl: './crear-desafio.component.html',
  styleUrls: ['./crear-desafio.component.scss'],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    ErrorAlertComponent
  ]
})

export class CrearDesafioComponent implements OnInit {
  desafioForm: FormGroup;
  tiposActividad = Object.values(TipoActividad);
  dificultades = Object.values(Dificultad);
  unidades = ['km', 'm', 'minutos', 'horas', 'repeticiones', 'series'];
  loading = false;
  error: string | null = null;
  currentUser: any;

  constructor(
    private fb: FormBuilder,
    private desafiosService: DesafiosService,
    private authService: AuthService,
    private router: Router
  ) {
    this.desafioForm = this.fb.group({
      titulo: ['', [Validators.required, Validators.maxLength(100)]],
      descripcion: ['', [Validators.required, Validators.maxLength(500)]],
      tipoActividad: [TipoActividad.CORRER, Validators.required],
      objetivo: [0, [Validators.required, Validators.min(0.1)]],
      unidadObjetivo: ['km', Validators.required],
      fechaInicio: ['', Validators.required],
      fechaFin: ['', Validators.required],
      esPublico: [true],
      dificultad: [Dificultad.INTERMEDIO, Validators.required],
      maxParticipantes: [10, [Validators.required, Validators.min(1)]]
    }, { validators: this.validarFechasValidator });
  }

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
      if (!user) {
        this.error = 'Debes iniciar sesión para crear un desafío';
        this.router.navigate(['/login']);
      }
    });
  }

  onSubmit(): void {
    if (this.desafioForm.invalid) {
      this.marcarCamposComoTocados();
      return;
    }

    if (!this.authService.isLoggedIn()) {
      this.error = 'Tu sesión ha expirado. Por favor, inicia sesión nuevamente.';
      this.router.navigate(['/login']);
      return;
    }

    this.loading = true;
    this.error = null;

    const formValue = this.desafioForm.value;
    
    // Obtener el icono basado en el tipo de actividad seleccionado
    const icono = this.getIconoFromTipoActividad(formValue.tipoActividad);
    
    const desafioDto = {
      titulo: formValue.titulo,
      descripcion: formValue.descripcion,
      tipo_actividad: formValue.tipoActividad,
      objetivo: formValue.objetivo,
      unidad_objetivo: formValue.unidadObjetivo,
      fecha_inicio: formValue.fechaInicio,
      fecha_fin: formValue.fechaFin,
      es_publico: formValue.esPublico,
      dificultad: formValue.dificultad,
      max_participantes: formValue.maxParticipantes,
      icono: icono 
    };

    this.desafiosService.crearDesafio(desafioDto as any).subscribe({
      next: (desafio) => {
        this.loading = false;
        this.router.navigate(['/desafios', desafio.id]);
      },
      error: (err) => {
        this.loading = false;
        if (err.status === 400) {
          this.error = err.error?.error || 'Datos inválidos. Verifica la información del desafío.';
        } else if (err.status === 403) {
          this.error = 'No tienes permisos para crear desafíos. Tu sesión puede haber expirado.';
          this.authService.logout().subscribe();
          this.router.navigate(['/login']);
        } else if (err.status === 401) {
          this.error = 'No autorizado. Por favor, inicia sesión nuevamente.';
          this.authService.logout().subscribe();
          this.router.navigate(['/login']);
        } else if (err.status === 500) {
          this.error = 'Error del servidor. Por favor, intenta más tarde.';
        } else {
          this.error = 'Error al crear el desafío. Por favor, inténtalo de nuevo.';
        }
      }
    });
  }

  private getIconoFromTipoActividad(tipoActividad: string): string {
    const iconos: {[key: string]: string} = {
      'correr': 'fa-running',
      'ciclismo': 'fa-bicycle', 
      'natacion': 'fa-swimmer',
      'gimnasio': 'fa-dumbbell',
      'otros': 'fa-star'
    };
  
    return iconos[tipoActividad] || 'fa-star';
  }

  private marcarCamposComoTocados(): void {
    Object.keys(this.desafioForm.controls).forEach(key => {
      this.desafioForm.get(key)?.markAsTouched();
    });
  }

  private validarFechasValidator(control: AbstractControl): { [key: string]: any } | null {
    const inicio = control.get('fechaInicio')?.value;
    const fin = control.get('fechaFin')?.value;
    if (inicio && fin) {
      return new Date(fin) > new Date(inicio) ? null : { fechasInvalidas: true };
    }
    return null;
  }

  validarFechas(): boolean {
    const inicio = this.desafioForm.get('fechaInicio')?.value;
    const fin = this.desafioForm.get('fechaFin')?.value;
    if (inicio && fin) {
      return new Date(fin) > new Date(inicio);
    }
    return true;
  }

  get fechasSonInvalidas(): boolean {
    const fechaFin = this.desafioForm.get('fechaFin');
    return this.desafioForm.hasError('fechasInvalidas') && (fechaFin?.touched || false);
  }
}