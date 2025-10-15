
import { Usuario } from "./usuario.model";
import { Desafio } from "./desafio.model";

export interface Comentario {
  id: number;
  texto: string;
  fecha: Date | string;
  usuario: Usuario;
  desafio: Desafio | number;
  respuestaA?: Comentario | number;
  respuestas?: Comentario[];
}

export interface CrearComentarioDto {
  texto: string;
  usuarioId: number;
  desafioId: number;
  respuestaAId?: number;
}