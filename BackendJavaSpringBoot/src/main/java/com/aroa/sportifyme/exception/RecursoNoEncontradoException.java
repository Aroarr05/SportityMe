package com.aroa.sportifyme.exception;

public class RecursoNoEncontradoException extends RuntimeException {

    public RecursoNoEncontradoException(String mensaje) {
        super(mensaje);
    }

    public RecursoNoEncontradoException(String nombreRecurso, Long id) {
        super(String.format("%s con ID %d no encontrado", nombreRecurso, id));
    }
}