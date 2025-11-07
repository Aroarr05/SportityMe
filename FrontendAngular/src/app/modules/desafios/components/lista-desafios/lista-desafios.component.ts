import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
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
    FormsModule
  ]
})
export class ListaDesafiosComponent implements OnInit {
  desafios: Desafio[] = [];
  desafiosFiltrados: Desafio[] = [];
  loading = true;
  error: string | null = null;
  isLoggedIn = false;
  isAdmin = false;
  

  filtroActividad: string = 'todos';
  tiposActividad = [
    { valor: 'todos', label: 'Todos los desafíos', icono: 'fa-list' },
    { valor: 'correr', label: 'Correr', icono: 'fa-running' },
    { valor: 'ciclismo', label: 'Ciclismo', icono: 'fa-bicycle' },
    { valor: 'natacion', label: 'Natación', icono: 'fa-swimmer' },
    { valor: 'gimnasio', label: 'Gimnasio', icono: 'fa-dumbbell' },
    { valor: 'otros', label: 'Otros', icono: 'fa-star' }
  ];

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
        this.desafios = this.normalizarDatosDesafios(desafios);
        this.aplicarFiltro(); 
        this.loading = false;
      },
      error: (err) => {
        console.error('Error:', err);
        this.error = 'Error al cargar los desafíos. Por favor, inténtalo de nuevo más tarde.';
        this.loading = false;
      }
    });
  }

  
  aplicarFiltro(): void {
    if (this.filtroActividad === 'todos') {
      this.desafiosFiltrados = [...this.desafios];
    } else {
      this.desafiosFiltrados = this.desafios.filter(desafio => 
        desafio.tipo_actividad === this.filtroActividad
      );
    }
  }

  // Método para cambiar filtro - EN EL COMPONENTE
  cambiarFiltro(nuevoFiltro: string): void {
    this.filtroActividad = nuevoFiltro;
    this.aplicarFiltro();
  }

 
  contarDesafiosPorTipo(tipo: string): number {
    if (tipo === 'todos') {
      return this.desafios.length;
    }
    return this.desafios.filter(desafio => desafio.tipo_actividad === tipo).length;
  }

  
  getBotonFiltroClase(tipo: string): string {
    const baseClases = 'flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-300 transform hover:scale-105';
    
    if (this.filtroActividad === tipo) {
      return `${baseClases} bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg`;
    } else {
      return `${baseClases} bg-white text-gray-700 border border-gray-200 hover:border-purple-300 hover:bg-purple-50`;
    }
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
}