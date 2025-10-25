import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DesafiosService } from '../../services/desafios.service';
import { AuthService } from '../../../../auth/services/auth.service';
import { Desafio } from '../../../../shared/models';

@Component({
  selector: 'app-lista-desafios',
  templateUrl: './lista-desafios.component.html',
  styleUrls: ['./lista-desafios.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
  ]
})

export class ListaDesafiosComponent implements OnInit {
  desafios: (Desafio & { progreso: number; dias_restantes: number })[] = [];
  loading = true;
  error: string | null = null;
  isLoggedIn = false;
  isAdmin = false;

  constructor(
    private desafiosService: DesafiosService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.checkAuthentication();
    this.cargarDesafios();
  }

  private checkAuthentication(): void {
    this.isLoggedIn = this.authService.isLoggedIn();
    this.isAdmin = this.authService.isAdmin(); 
  }

  cargarDesafios(): void {
    this.loading = true;
    this.error = null;

    this.desafiosService.obtenerDesafios().subscribe({
      next: (desafios) => {
        console.log('Datos recibidos:', desafios);
        const normalizados = this.normalizarDatosDesafios(desafios);
        this.desafios = normalizados.map(d => this.calcularDatosExtras(d));
        this.loading = false;
      },
      error: (err) => {
        console.error('Error:', err);
        this.error = 'Error al cargar los desafíos. Por favor, inténtalo de nuevo más tarde.';
        this.loading = false;
      }
    });
  }

  private normalizarDatosDesafios(datos: any[]): Desafio[] {
    if (!datos || !Array.isArray(datos)) return [];

    return datos.map(item => {
      const icono = item.icono || this.getIconoFromTipoActividad(
        item.tipoActividad || item.tipo_actividad
      );

      return {
        id: item.id || 0,
        titulo: item.titulo || 'Sin título',
        descripcion: item.descripcion || '',
        tipo_actividad: item.tipoActividad || item.tipo_actividad || 'otros',
        objetivo: item.objetivo || 0,
        unidad_objetivo: item.unidadObjetivo || item.unidad_objetivo || '',
        fecha_inicio: item.fechaInicio || item.fecha_inicio || new Date().toISOString(),
        fecha_fin: item.fechaFin || item.fecha_fin || new Date().toISOString(),
        creador_id: item.creadorId || item.creador_id || 0,
        es_publico: item.esPublico ?? item.es_publico ?? true,
        dificultad: item.dificultad || 'INTERMEDIO',
        max_participantes: item.maxParticipantes || item.max_participantes || 0,
        imagen_url: item.imagenUrl || item.imagen_url || '',
        estado: item.estado || 'ACTIVO',
        icono: icono
      };
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

  private calcularDatosExtras(desafio: Desafio): Desafio & { progreso: number; dias_restantes: number } {
    const fechaInicio = new Date(desafio.fecha_inicio);
    const fechaFin = new Date(desafio.fecha_fin);
    const hoy = new Date();

    const totalDias = Math.ceil((fechaFin.getTime() - fechaInicio.getTime()) / (1000 * 60 * 60 * 24));
    const diasTranscurridos = Math.max(0, Math.min(totalDias, Math.ceil((hoy.getTime() - fechaInicio.getTime()) / (1000 * 60 * 60 * 24))));
    const progreso = totalDias > 0 ? Math.round((diasTranscurridos / totalDias) * 100) : 0;
    const dias_restantes = Math.max(0, totalDias - diasTranscurridos);

    return { ...desafio, progreso, dias_restantes };
  }

}