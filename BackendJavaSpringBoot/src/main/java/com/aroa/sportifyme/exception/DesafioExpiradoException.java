package com.aroa.sportifyme.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.BAD_REQUEST)
public class DesafioExpiradoException extends RuntimeException {
    public DesafioExpiradoException(Long desafioId) {
        super(String.format("El desafío %d ya ha finalizado", desafioId));
    }
}