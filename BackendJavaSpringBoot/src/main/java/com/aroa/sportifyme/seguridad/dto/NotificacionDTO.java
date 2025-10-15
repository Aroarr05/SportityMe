package com.aroa.sportifyme.seguridad.dto;

import com.aroa.sportifyme.modelo.Notificacion;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class NotificacionDTO {
    private Long id;
    private String tipo;
    private String mensaje;
    private String enlace;
    private boolean leida;
    private LocalDateTime fechaCreacion;
    private Long usuarioId; 
    public NotificacionDTO(Notificacion notificacion) {
        this.id = notificacion.getId();
        this.tipo = notificacion.getTipo().name();
        this.mensaje = notificacion.getMensaje();
        this.enlace = notificacion.getEnlace();
        this.leida = notificacion.isLeida(); 
        this.fechaCreacion = notificacion.getFechaCreacion();
        this.usuarioId = notificacion.getUsuario() != null ? notificacion.getUsuario().getId() : null;
    }
}