package com.aroa.sportifyme.exception;

public class DesafioNoEncontradoException extends RuntimeException {
    public DesafioNoEncontradoException(Long id) {
        super("Desafío con ID " + id + " no encontrado");
    }
}
