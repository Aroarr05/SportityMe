package com.aroa.sportifyme.seguridad.dto;

import com.aroa.sportifyme.modelo.Desafio;
import java.math.BigDecimal;
import java.time.LocalDateTime;

public record DesafioDTO(
        Long id,
        String titulo,
        String descripcion,
        Desafio.TipoActividad tipoActividad,
        BigDecimal objetivo,
        String unidadObjetivo,
        LocalDateTime fechaInicio,
        LocalDateTime fechaFin,
        CreadorDTO creador,  
        Boolean esPublico,
        String imagenUrl,
        Desafio.Dificultad dificultad,
        Integer maxParticipantes
) {
    public record CreadorDTO(Long id, String nombre, String email) {}
    
    public static DesafioDTO fromEntity(Desafio desafio) {
        CreadorDTO creadorDTO = null;
        if (desafio.getCreador() != null) {
            creadorDTO = new CreadorDTO(
                desafio.getCreador().getId(),
                desafio.getCreador().getNombre(),
                desafio.getCreador().getEmail()
            );
        }
        
        return new DesafioDTO(
                desafio.getId(),
                desafio.getTitulo(),
                desafio.getDescripcion(),
                desafio.getTipoActividad(),
                desafio.getObjetivo(),
                desafio.getUnidadObjetivo(),
                desafio.getFechaInicio(),
                desafio.getFechaFin(),
                creadorDTO,  
                desafio.getEsPublico(),
                desafio.getImagenUrl(),
                desafio.getDificultad(),
                desafio.getMaxParticipantes()
        );
    }
}