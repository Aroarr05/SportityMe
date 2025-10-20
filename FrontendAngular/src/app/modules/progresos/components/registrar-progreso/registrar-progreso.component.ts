import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ProgresosService } from '../../services/progresos.service';
import { DesafiosService } from '../../../desafios/services/desafios.service';
import { Progreso, CrearProgresoDto } from '../../../../shared/models';
import { Desafio } from '../../../../shared/models';

@Component({
  selector: 'app-registrar-progreso',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './registrar-progreso.component.html',
  styleUrls: ['./registrar-progreso.component.scss']
})
export class RegistrarProgresoComponent implements OnInit {
  progresoDto: CrearProgresoDto = {
    desafioId: 0,
    valorActual: 0,
    unidad: '',
    comentario: '',
    dispositivo: 'web'
  };

  cargando: boolean = false;
  cargandoDesafios: boolean = false;
  enviado: boolean = false;
  error: string = '';

  desafios: Desafio[] = [];
  desafioSeleccionado: Desafio | null = null;

  constructor(
    private progresosService: ProgresosService,
    private desafiosService: DesafiosService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.cargarDesafios();
  
    const desafioId = this.route.snapshot.paramMap.get('desafioId');
    if (desafioId) {
      this.progresoDto.desafioId = +desafioId;
    }
  }

  cargarDesafios() {
    this.cargandoDesafios = true;
    
    this.desafiosService.obtenerDesafiosActivos().subscribe({
      next: (desafios) => {
        this.desafios = desafios;
        this.cargandoDesafios = false;
        
        if (this.progresoDto.desafioId) {
          this.onDesafioChange();
        }
      },
      error: (error) => {
        this.error = 'Error al cargar los desafíos';
        this.cargandoDesafios = false;
        console.error('Error:', error);
      }
    });
  }

  registrarProgreso() {
    if (!this.validarFormulario()) return;

    this.cargando = true;
    this.error = '';

    this.progresosService.registrarProgreso(this.progresoDto).subscribe({
      next: (progreso) => {
        this.cargando = false;
        this.enviado = true;
        console.log('Progreso registrado:', progreso);
        
        setTimeout(() => {
          this.router.navigate(['/progresos', 'mis-progresos']);
        }, 2000);
      },
      error: (error) => {
        this.cargando = false;
        this.error = error.error?.message || 'Error al registrar el progreso';
        console.error('Error:', error);
      }
    });
  }

  validarFormulario(): boolean {
    if (this.progresoDto.valorActual <= 0) {
      this.error = 'El valor debe ser mayor a 0';
      return false;
    }
    if (!this.progresoDto.unidad) {
      this.error = 'Debe seleccionar una unidad';
      return false;
    }
    if (!this.progresoDto.desafioId) {
      this.error = 'Debe seleccionar un desafío';
      return false;
    }
    return true;
  }

  onDesafioChange() {
    this.desafioSeleccionado = this.desafios.find(d => d.id === this.progresoDto.desafioId) || null;
    
    if (this.desafioSeleccionado) {
      this.progresoDto.unidad = this.desafioSeleccionado.unidad_objetivo;
    } else {
      this.progresoDto.unidad = '';
    }
  }

  getDesafioTitulo(desafio: Desafio): string {
    return `${desafio.titulo} - ${desafio.objetivo} ${desafio.unidad_objetivo}`;
  }

  get porcentajeCompletado(): number {
    if (!this.desafioSeleccionado || this.desafioSeleccionado.objetivo <= 0) {
      return 0;
    }
    
    const porcentaje = (this.progresoDto.valorActual / this.desafioSeleccionado.objetivo) * 100;
    return Math.min(porcentaje, 100);
  }

  cancelar() {
    this.router.navigate(['/progresos']);
  }
}