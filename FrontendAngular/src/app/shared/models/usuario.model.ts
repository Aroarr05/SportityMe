export interface Usuario {
  id: number;
  nombre: string;
  email: string;
  contraseña?: string;              
  fechaNacimiento?: string;         
  fechaRegistro: string;            
  avatarUrl?: string;               
  peso?: number;
  altura?: number;
  biografia?: string;
  ubicacion?: string;
  genero?: 'masculino' | 'femenino' | 'otro' | 'no_especificado'; 
  ultimoLogin?: string;             
  rol?: 'usuario' | 'admin' | 'moderador'; 
  
  deportesFavoritos?: string[];
  totalDesafiosCompletados?: number;
  mejorPosicionRanking?: number;
  tiempoTotalEntrenamiento?: number;
}

export enum Rol {
  USUARIO = 'usuario',
  ADMIN = 'admin', 
  MODERADOR = 'moderador'
}