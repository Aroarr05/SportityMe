package com.aroa.sportifyme.exception;

public class AccesoNoAutorizadoException extends RuntimeException {
    public AccesoNoAutorizadoException(String accion, String recurso, Long id) {
        super("No tienes permiso para " + accion + " el " + recurso + " con ID: " + id);
    }
}