package com.aroa.sportifyme.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.NOT_FOUND)
public class NotificacionNoEncontradaException extends RuntimeException {
    public NotificacionNoEncontradaException(Long notificacionId, Long usuarioId) {
        super("No se encontró la notificación con ID " + notificacionId + " para el usuario " + usuarioId);
    }
}