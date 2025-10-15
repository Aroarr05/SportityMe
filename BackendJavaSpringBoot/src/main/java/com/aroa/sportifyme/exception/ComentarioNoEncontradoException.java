package com.aroa.sportifyme.exception;

public class ComentarioNoEncontradoException extends RuntimeException {
    public ComentarioNoEncontradoException(Long id) {
        super("Comentario no encontrado con ID: " + id);
    }
}
