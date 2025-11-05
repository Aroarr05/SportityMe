export interface Ranking {
  usuarioId: number;
  nombre: string;
  avatarUrl?: string;
  totalDesafios?: number;
  porcentajeCompletado?: number;
  valorActual?: number;
  posicion?: number;
}

export interface FiltroRanking {
  tipo: 'desafio' | 'global';
  desafioId?: number;
  limit?: number;
}
