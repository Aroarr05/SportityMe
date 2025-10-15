import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { DesafiosService } from '../../services/desafios.service';
import { TipoActividad } from '../../../../shared/models';
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
  dificultades = ['principiante', 'intermedio', 'avanzado'];
  unidades = ['km', 'm', 'minutos', 'horas', 'repeticiones', 'series'];
  loading = false;
  error: string | null = null;

  constructor(
    private fb: FormBuilder,
    private desafiosService: DesafiosService,
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
      dificultad: ['intermedio', Validators.required],
      maxParticipantes: [10, [Validators.required, Validators.min(1)]] 
    });
  }

  ngOnInit(): void {}

  onSubmit(): void {
    if (this.desafioForm.invalid) {
      this.marcarCamposComoTocados();
      return;
    }

    this.loading = true;
    this.error = null;

    const desafioDto = this.desafioForm.value;
    
    // Asegurar que las fechas tengan formato correcto
    if (desafioDto.fechaInicio) {
      desafioDto.fechaInicio = new Date(desafioDto.fechaInicio).toISOString();
    }
    if (desafioDto.fechaFin) {
      desafioDto.fechaFin = new Date(desafioDto.fechaFin).toISOString();
    }

    this.desafiosService.crearDesafio(desafioDto).subscribe({
      next: (desafio) => {
        this.loading = false;
        this.router.navigate(['/desafios', desafio.id]);
      },
      error: (err) => {
        this.error = 'Error al crear el desafío. Por favor, inténtalo de nuevo.';
        this.loading = false;
        console.error(err);
      }
    });
  }

  private marcarCamposComoTocados(): void {
    Object.keys(this.desafioForm.controls).forEach(key => {
      this.desafioForm.get(key)?.markAsTouched();
    });
  }

  // Validación para fecha fin mayor que fecha inicio
  validarFechas(): boolean {
    const inicio = this.desafioForm.get('fechaInicio')?.value;
    const fin = this.desafioForm.get('fechaFin')?.value;
    
    if (inicio && fin) {
      return new Date(fin) > new Date(inicio);
    }
    return true;
  }
}