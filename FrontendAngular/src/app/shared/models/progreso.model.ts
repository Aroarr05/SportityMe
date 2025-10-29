import { Usuario } from "./usuario.model";
import { Desafio } from "./desafio.model";

export interface Progreso {
  id: number;
  usuario_id: number;        
  desafio_id: number;        
  valor_actual: number;      
  unidad: string; 
  fecha_registro: Date;      
  comentario?: string;
  dispositivo?: string; 
  
  porcentaje_completado?: number;  
  completado?: boolean;
  
  usuario?: Usuario;        
  desafio?: Desafio;        
}

export interface CrearProgresoDto {
  desafio_id: number;        
  valor_actual: number;      
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