import { Usuario } from './usuario.model';
import { Desafio } from './desafio.model';

export interface Progreso {
  id: number;
  usuario: Usuario | number;
  desafio: Desafio | number;
  valor: number;
  unidad: UnidadMedida;
  fecha: Date;
  comentario?: string;
  validado?: boolean;
}

export interface CrearProgresoDto {
  valor: number;
  unidad: string;
  usuarioId: number;
  desafioId: number;
}

export enum UnidadMedida {
  KILOMETROS = 'KILOMETROS',
  METROS = 'METROS',
  MINUTOS = 'MINUTOS',
  HORAS = 'HORAS',
  REPETICIONES = 'REPETICIONES',
  KILOGRAMOS = 'KILOGRAMOS'
}