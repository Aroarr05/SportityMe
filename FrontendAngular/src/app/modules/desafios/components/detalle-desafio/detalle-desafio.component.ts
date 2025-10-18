import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';
import { DesafiosService } from '../../services/desafios.service';
import { AuthService } from '../../../../auth/services/auth.service';
import { LoadingSpinnerComponent } from '../../../../shared/components/loading-spinner/loading-spinner.component';
import { ErrorAlertComponent } from '../../../../shared/components/error-alert/error-alert.component';
import { Desafio } from '../../../../shared/models';

@Component({
  standalone: true,
  selector: 'app-detalle-desafio',
  templateUrl: './detalle-desafio.component.html',
  styleUrls: ['./detalle-desafio.component.scss'],
  imports: [
    CommonModule,
    RouterModule,
    LoadingSpinnerComponent,
    ErrorAlertComponent
  ]
})

export class DetalleDesafioComponent implements OnInit, OnDestroy {
  desafio: Desafio | null = null;
  participantes: any[] = [];
  creadorNombre: string = 'Usuario';
  loading = false;
  unirseLoading = false;
  error: string | null = null;
  usuarioActualId: number | null = null;
  desafioId!: number;
  
  private subscriptions: Subscription = new Subscription();

  constructor(
    private route: ActivatedRoute,
    private desafiosService: DesafiosService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.obtenerIdDesafio();
    this.obtenerUsuarioActual();
  }

  private obtenerIdDesafio(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.desafioId = +id;
      this.cargarDesafio();
      this.cargarParticipantes();
    } else {
      this.error = 'ID de desafío no válido';
    }
  }

  cargarDesafio(): void {
    this.loading = true;
    this.error = null;
    
    const sub = this.desafiosService.obtenerDesafioPorId(this.desafioId).subscribe({
      next: (desafio: Desafio) => {
        this.desafio = desafio;
        this.obtenerNombreCreador(desafio);
        this.loading = false;
        console.log('Desafío cargado:', desafio);
      },
      error: (err: any) => {
        this.error = 'Error al cargar el desafío. Intenta nuevamente.';
        this.loading = false;
        console.error('Error cargando desafío:', err);
      }
    });
    
    this.subscriptions.add(sub);
  }

  cargarParticipantes(): void {
    const sub = this.desafiosService.obtenerParticipantes(this.desafioId).subscribe({
      next: (participantes: any[]) => {
        this.participantes = participantes;
        console.log('Participantes cargados:', participantes);
      },
      error: (err: any) => {
        console.error('Error cargando participantes:', err);
        this.participantes = [];
      }
    });
    
    this.subscriptions.add(sub);
  }

  obtenerUsuarioActual(): void {
    const usuario = this.authService.getCurrentUser();
    this.usuarioActualId = usuario?.id || null;
    console.log('Usuario actual ID:', this.usuarioActualId);
  }

  obtenerNombreCreador(desafio: Desafio): void {

    if ((desafio as any).creador && (desafio as any).creador.nombre) {
      this.creadorNombre = (desafio as any).creador.nombre;
      return;
    }

    const creadorEnParticipantes = this.participantes.find(p => p.id === desafio.creador_id);
    if (creadorEnParticipantes && creadorEnParticipantes.nombre) {
      this.creadorNombre = creadorEnParticipantes.nombre;
      return;
    }

    setTimeout(() => {
      const creador = this.participantes.find(p => p.id === desafio.creador_id);
      if (creador && creador.nombre) {
        this.creadorNombre = creador.nombre;
      } else {
        this.creadorNombre = `Usuario ${desafio.creador_id}`;
      }
    }, 1000);


    this.creadorNombre = `Usuario ${desafio.creador_id}`;
  }


  getNombreCreador(): string {
    if (!this.desafio) return 'Usuario';
    
    
    if ((this.desafio as any).creador && (this.desafio as any).creador.nombre) {
      return (this.desafio as any).creador.nombre;
    }

    const creador = this.participantes.find(p => p.id === this.desafio?.creador_id);
    if (creador && creador.nombre) {
      return creador.nombre;
    }

    if (this.desafio.creador_id) {
      return `Usuario ${this.desafio.creador_id}`;
    }
    
    return 'Usuario';
  }


  esDesafioExpirado(): boolean {
    if (!this.desafio?.fecha_fin) return false;
    return new Date(this.desafio.fecha_fin) < new Date();
  }

  esDesafioCompleto(): boolean {
    if (!this.desafio?.max_participantes) return false;
    return this.participantes.length >= this.desafio.max_participantes;
  }

  yaEsParticipante(): boolean {
    if (!this.usuarioActualId || !this.participantes.length) return false;
    return this.participantes.some((p: any) => p.id === this.usuarioActualId);
  }

  getTotalParticipantes(): number {
    return this.participantes.length;
  }

  getClaseDificultad(): string {
    const dificultad = (this.desafio?.dificultad || '').toLowerCase();
    switch(dificultad) {
      case 'principiante': return 'bg-green-100 text-green-800 border border-green-200';
      case 'intermedio': return 'bg-yellow-100 text-yellow-800 border border-yellow-200';
      case 'avanzado': return 'bg-red-100 text-red-800 border border-red-200';
      default: return 'bg-gray-100 text-gray-800 border border-gray-200';
    }
  }

  getClaseBotonUnirse(): string {
    if (this.yaEsParticipante()) {
      return 'bg-gray-400 text-white cursor-not-allowed';
    }
    if (this.esDesafioExpirado() || this.esDesafioCompleto()) {
      return 'bg-red-400 text-white cursor-not-allowed';
    }
    if (this.unirseLoading) {
      return 'bg-blue-400 text-white cursor-wait';
    }
    return 'bg-green-500 hover:bg-green-600 text-white cursor-pointer';
  }

  getTextoBoton(): string {
    if (this.yaEsParticipante()) return 'Ya participas';
    if (this.esDesafioExpirado()) return 'Desafío expirado';
    if (this.esDesafioCompleto()) return 'Cupo completo';
    if (this.unirseLoading) return 'Uniéndose...';
    return 'Unirse al desafío';
  }

  getIconoClase(tipo: string): string {
    switch (tipo) {
      case 'correr': return 'bg-orange-100 text-orange-600';
      case 'ciclismo': return 'bg-yellow-100 text-yellow-600';
      case 'natacion': return 'bg-blue-100 text-blue-600';
      case 'gimnasio': return 'bg-red-100 text-red-600';
      case 'senderismo': return 'bg-green-100 text-green-600';
      case 'yoga': return 'bg-purple-100 text-purple-600';
      default: return 'bg-gray-100 text-gray-500';
    }
  }

  private getIconoFromTipoActividad(tipoActividad: string): string {
    const iconos: {[key: string]: string} = {
      'correr': 'fa-running',
      'ciclismo': 'fa-bicycle',
      'natacion': 'fa-swimmer',
      'gimnasio': 'fa-dumbbell',
      'senderismo': 'fa-hiking',
      'yoga': 'fa-spa',
      'otros': 'fa-star'
    };
    return iconos[tipoActividad] || 'fa-star';
  }

  getIconoTipoActividad(): string {
    const tipo = this.desafio?.tipo_actividad || '';
    return this.getIconoFromTipoActividad(tipo);
  }

  unirseADesafio(): void {
    if (this.yaEsParticipante() || this.esDesafioExpirado() || this.esDesafioCompleto()) {
      return;
    }

    this.unirseLoading = true;
    this.error = null;
    
    const sub = this.desafiosService.unirseADesafio(this.desafioId).subscribe({
      next: (response: any) => {
        this.unirseLoading = false;
        console.log('Unido al desafío:', response);
        
        this.cargarParticipantes();
        this.error = null;
      },
      error: (err: any) => {
        this.unirseLoading = false;
        const mensajeError = err.error?.message || err.error?.error || 'Error al unirse al desafío';
        this.error = ` ${mensajeError}`;
        console.error('Error uniéndose al desafío:', err);
      }
    });
    
    this.subscriptions.add(sub);
  }

  recargarDatos(): void {
    this.error = null;
    this.cargarDesafio();
    this.cargarParticipantes();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  // Agrega estos métodos a tu componente

calcularProgresoTiempo(): number {
  if (!this.desafio) return 0;
  
  const fechaInicio = new Date(this.desafio.fecha_inicio);
  const fechaFin = new Date(this.desafio.fecha_fin);
  const ahora = new Date();
  
  const totalTiempo = fechaFin.getTime() - fechaInicio.getTime();
  const tiempoTranscurrido = ahora.getTime() - fechaInicio.getTime();
  
  if (totalTiempo <= 0) return 100;
  if (tiempoTranscurrido <= 0) return 0;
  if (tiempoTranscurrido >= totalTiempo) return 100;
  
  return (tiempoTranscurrido / totalTiempo) * 100;
}

calcularDiasTranscurridos(): number {
  if (!this.desafio) return 0;
  
  const fechaInicio = new Date(this.desafio.fecha_inicio);
  const ahora = new Date();
  
  const diferencia = ahora.getTime() - fechaInicio.getTime();
  return Math.max(0, Math.floor(diferencia / (1000 * 60 * 60 * 24)));
}

calcularDiasRestantes(): number {
  if (!this.desafio) return 0;
  
  const fechaFin = new Date(this.desafio.fecha_fin);
  const ahora = new Date();
  
  const diferencia = fechaFin.getTime() - ahora.getTime();
  return Math.max(0, Math.floor(diferencia / (1000 * 60 * 60 * 24)));
}
}