package com.aroa.sportifyme.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.FORBIDDEN)
public class LimiteParticipantesException extends RuntimeException {
    public LimiteParticipantesException(Long desafioId, Integer maxParticipantes) {
        super(String.format("El desafío %d ha alcanzado el límite de %d participantes",
                desafioId, maxParticipantes));
    }
}