export interface Ranking {
  posicion: number;
  usuario: {
    id: number;
    nombre: string;
    email: string;
    avatarUrl?: string;
  };
  puntuacion: number;
  desafiosCompletados: number;
  progresoTotal: number;
}

export interface FiltroRanking {
  tipo?: 'global' | 'desafio';
  desafioId?: number;
  fechaInicio?: Date;
  fechaFin?: Date;
  limit?: number;
}
