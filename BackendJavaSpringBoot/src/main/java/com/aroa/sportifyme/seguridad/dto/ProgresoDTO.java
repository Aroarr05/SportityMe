package com.aroa.sportifyme.seguridad.dto;

import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
public class ProgresoDTO {
    private Long id;
    private Long usuarioId;       
    private Long desafioId;
    private BigDecimal valorActual;
    private String unidad;
    private LocalDateTime fechaRegistro;  
    private String comentario;
    private String dispositivo;

    
    public static ProgresoDTO fromEntity(com.aroa.sportifyme.modelo.Progreso progreso) {
        if (progreso == null) {
            return null;
        }
        
        ProgresoDTO dto = new ProgresoDTO();
        dto.setId(progreso.getId());
        dto.setUsuarioId(progreso.getUsuario() != null ? progreso.getUsuario().getId() : null);
        dto.setDesafioId(progreso.getDesafio() != null ? progreso.getDesafio().getId() : null);
        dto.setValorActual(progreso.getValorActual());
        dto.setUnidad(progreso.getUnidad());
        dto.setFechaRegistro(progreso.getFechaRegistro());
        dto.setComentario(progreso.getComentario());
        dto.setDispositivo(progreso.getDispositivo());
        
        return dto;
    }
}