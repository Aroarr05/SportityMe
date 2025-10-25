export interface Usuario {
  id: number;
  nombre: string;
  email: string;
  contraseña: string; 
  rol_id: number;
  avatar_url?: string;
  biografia?: string;
  ubicacion?: string;
  fecha_nacimiento?: string;  
  genero?: 'MASCULINO' | 'FEMENINO' | 'OTRO' | 'NO_ESPECIFICADO'; 
  peso?: number;
  altura?: number;
  fecha_registro: string;
  ultimo_login?: string;
  activo: boolean;  
}

export enum Rol {
  ADMIN = 'ADMIN',
  USUARIO = 'USUARIO'
}

export enum Genero {
  MASCULINO = 'MASCULINO',
  FEMENINO = 'FEMENINO', 
  OTRO = 'OTRO',
  NO_ESPECIFICADO = 'NO_ESPECIFICADO'
}