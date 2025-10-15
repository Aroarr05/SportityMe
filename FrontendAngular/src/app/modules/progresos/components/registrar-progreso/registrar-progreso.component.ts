import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { ProgresosService } from '../../services/progresos.service';
import { DesafiosService } from '../../../desafios/services/desafios.service';
import { Desafio } from '../../../../shared/models';
import { CrearProgresoDto, UnidadMedida } from '../../../../shared/models/progreso.model';

@Component({
  standalone: true,
  selector: 'app-registrar-progreso',
  templateUrl: './registrar-progreso.component.html',
  styleUrls: ['./registrar-progreso.component.scss'],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule
  ]
})
export class RegistrarProgresoComponent implements OnInit {
  desafio?: Desafio;
  unidadesMedida = Object.values(UnidadMedida);
  
  progreso: CrearProgresoDto = {
    valor: 0,
    unidad: UnidadMedida.KILOMETROS,
    usuarioId: 1, 
    desafioId: 0
  };

  fechaRegistro: string = new Date().toISOString().split('T')[0];
  comentario: string = '';

  constructor(
    private progresosService: ProgresosService,
    private desafiosService: DesafiosService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    const desafioId = this.route.snapshot.paramMap.get('desafioId');
    if (desafioId) {
      const id = parseInt(desafioId);
      this.progreso.desafioId = id;
      
      this.desafiosService.obtenerDesafioPorId(id).subscribe({
        next: (desafio: Desafio) => this.desafio = desafio,
        error: (err: any) => console.error('Error al cargar desafío:', err)
      });
    }
  }

  onSubmit() {
    if (this.desafio?.id) {
      // Agregar fecha y comentario al DTO
      const progresoCompleto = {
        ...this.progreso,
        fecha: this.fechaRegistro,
        comentario: this.comentario
      };

      this.progresosService.registrarProgreso(progresoCompleto).subscribe({
        next: () => {
          alert('Progreso registrado con éxito');
          this.router.navigate(['/desafios', this.desafio?.id]);
        },
        error: (err) => {
          console.error('Error al registrar progreso:', err);
          alert('Error al registrar progreso: ' + (err.error?.message || err.message));
        }
      });
    }
  }

  cancelar() {
    if (this.desafio?.id) {
      this.router.navigate(['/desafios', this.desafio.id]);
    } else {
      this.router.navigate(['/desafios']);
    }
  }

  getUnidadTexto(unidad: UnidadMedida): string {
    const textos: { [key in UnidadMedida]: string } = {
      [UnidadMedida.KILOMETROS]: 'Kilómetros',
      [UnidadMedida.METROS]: 'Metros',
      [UnidadMedida.MINUTOS]: 'Minutos',
      [UnidadMedida.HORAS]: 'Horas',
      [UnidadMedida.REPETICIONES]: 'Repeticiones',
      [UnidadMedida.KILOGRAMOS]: 'Kilogramos'
    };
    return textos[unidad];
  }
}