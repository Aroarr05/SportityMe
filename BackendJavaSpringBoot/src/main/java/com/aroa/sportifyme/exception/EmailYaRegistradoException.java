package com.aroa.sportifyme.exception;

public class EmailYaRegistradoException extends RuntimeException {
    public EmailYaRegistradoException(String email) {
        super("El email " + email + " ya está registrado");
    }
}