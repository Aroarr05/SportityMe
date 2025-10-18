export interface Desafio {
  id: number;
  titulo: string;                    
  descripcion: string;
  tipo_actividad: string;           
  objetivo: number;                  
  unidad_objetivo: string;        
  fecha_inicio: string;                 
  fecha_fin: string;                     
  creador_id: number;      
  es_publico: boolean;                     
  dificultad: string;              
  max_participantes: number;           
  icono?: string;                        
  estado?: string;           
  fecha_creacion?: string;   
  fecha_actualizacion?: string; 
}

export interface CrearDesafioDto {
  titulo: string;  
  descripcion: string;
  tipo_actividad: TipoActividad;  
  objetivo: number;  
  unidad_objetivo: string;  
  fecha_inicio: string;     
  fecha_fin: string;       
  creador_id: number;       
  es_publico: boolean;      
  dificultad: string;  
  max_participantes: number;  
  imagen_url?: string;       
}

export enum TipoActividad {
  CORRER = 'correr',  
  CICLISMO = 'ciclismo',  
  NADAR = 'natacion', 
  GIMNASIO = 'gimnasio',  
  SENDERISMO = 'senderismo',  
  YOGA = 'yoga',  
  OTRO = 'otros'  
}