export interface Ranking {
  usuarioId: number;
  nombre: string;
  avatarUrl?: string;
  totalDesafiosCompletados?: number;
  progresoActual?: number;
  posicion?: number;
}

export interface FiltroRanking {
  tipo: 'global' | 'desafio';
  desafioId?: number;
  limit?: number;
}