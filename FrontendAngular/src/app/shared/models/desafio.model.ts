export interface Desafio {
  id: number;
  titulo: string;                    
  descripcion: string;
  tipoActividad: string;            
  objetivo: number;                  
  unidadObjetivo: string;            
  fechaInicio: string;               
  fechaFin: string;                 
  creadorId: number;  
  esPublico: boolean;                
  dificultad: string;              
  maxParticipantes: number;          
  imagenUrl?: string;                
}

export interface CrearDesafioDto {
  titulo: string;  
  descripcion: string;
  tipoActividad: TipoActividad;
  objetivo: number;  
  unidadObjetivo: string;  
  fechaInicio: string;  
  fechaFin: string;  
  creadorId: number;  
  esPublico: boolean;  
  dificultad: string;  
  maxParticipantes: number;  
  imagenUrl?: string;  
}

export enum TipoActividad {
  CORRER = 'correr',  
  CICLISMO = 'ciclismo',  
  NADAR = 'nadar',  
  GIMNASIO = 'gimnasio',  
  SENDERISMO = 'senderismo',  
  YOGA = 'yoga',  
  OTRO = 'otro'  
}