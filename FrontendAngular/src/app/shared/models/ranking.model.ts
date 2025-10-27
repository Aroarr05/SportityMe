import { TipoActividad } from "./desafio.model";


export interface Ranking {
  usuarioId: number;
  nombre: string;
  avatarUrl?: string;
  totalDesafiosCompletados?: number;
  progresoActual?: number;
  posicion?: number;
}

export interface FiltroRanking {
  tipo: 'desafio';
  desafioId?: number;
  tipoActividad?: TipoActividad;
  limit?: number;
}