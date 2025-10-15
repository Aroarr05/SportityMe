import { Usuario } from './usuario.model';

export interface Ranking {
  posicion: number;
  usuario: Usuario;
  puntuacion: number;
  desafiosCompletados: number;
  progresoTotal: number;
}

export interface RankingDesafio {
  desafioId: number;
  nombreDesafio: string;
  ranking: Ranking[];
}

export interface FiltroRanking {
  tipo?: string;
  fechaInicio?: Date;
  fechaFin?: Date;
  limit?: number;
}