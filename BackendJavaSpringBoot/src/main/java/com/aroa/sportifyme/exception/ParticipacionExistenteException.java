package com.aroa.sportifyme.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.CONFLICT)
public class ParticipacionExistenteException extends RuntimeException {
    public ParticipacionExistenteException(Long usuarioId, Long desafioId) {
        super(String.format("El usuario con ID %d ya está participando en el desafío con ID %d", usuarioId, desafioId));
    }
}