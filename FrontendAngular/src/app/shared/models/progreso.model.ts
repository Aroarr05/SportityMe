import { Usuario } from './usuario.model';
import { Desafio } from './desafio.model';

export interface Progreso {
  id: number;
  usuario: Usuario; 
  desafio: Desafio; 
  valorActual: number; 
  unidad: string; 
  fechaRegistro: Date; 
  comentario?: string;
  dispositivo?: string; 
 
  porcentajeCompletado?: number;
  completado?: boolean;
}

export interface CrearProgresoDto {
  desafioId: number;
  valorActual: number;
  unidad: string;
  comentario?: string;
  dispositivo?: string;
}

export enum UnidadMedida {
  KILOMETROS = 'km',
  METROS = 'm', 
  MINUTOS = 'min',
  HORAS = 'h',
  REPETICIONES = 'rep',
  KILOGRAMOS = 'kg'
}