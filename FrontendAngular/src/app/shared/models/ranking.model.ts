export interface Ranking {
  usuarioId: number; 
  nombre: string;  
  avatarUrl?: string; 
  totalDesafiosCompletados: number; 
  progresoActual?: number; 
  posicion: number;
}

export interface RankingDesafio {
  desafioId: number;
  nombreDesafio: string;
  ranking: Ranking[];
}

export interface FiltroRanking {
  tipo?: 'global' | 'desafio'; 
  desafioId?: number; 
  fechaInicio?: Date;
  fechaFin?: Date;
  limit?: number;
}