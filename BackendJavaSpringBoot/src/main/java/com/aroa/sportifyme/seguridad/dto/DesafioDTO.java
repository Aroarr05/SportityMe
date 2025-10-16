package com.aroa.sportifyme.seguridad.dto;

import com.aroa.sportifyme.modelo.Desafio;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class DesafioDTO {
    private Long id;
    private String titulo;
    private String descripcion;
    private String tipoActividad; 
    private Double objetivo;
    private String unidadObjetivo;
    private LocalDateTime fechaInicio;
    private LocalDateTime fechaFin;
    private Long creadorId;
    private Boolean esPublico;
    private String dificultad; 
    private Integer maxParticipantes;
    private String imagenUrl;
    private String estado;

    public static DesafioDTO fromEntity(Desafio desafio) {
        if (desafio == null) {
            return null;
        }
        
        DesafioDTO dto = new DesafioDTO();
        dto.setId(desafio.getId());
        dto.setTitulo(desafio.getTitulo());
        dto.setDescripcion(desafio.getDescripcion());
        
  
        if (desafio.getTipoActividad() != null) {
            dto.setTipoActividad(desafio.getTipoActividad().name());
        }
        
        dto.setObjetivo(desafio.getObjetivo() != null ? desafio.getObjetivo().doubleValue() : null);
        dto.setUnidadObjetivo(desafio.getUnidadObjetivo());
        dto.setFechaInicio(desafio.getFechaInicio());
        dto.setFechaFin(desafio.getFechaFin());
        dto.setCreadorId(desafio.getCreador() != null ? desafio.getCreador().getId() : null);
        dto.setEsPublico(desafio.getEsPublico());
        
 
        if (desafio.getDificultad() != null) {
            dto.setDificultad(desafio.getDificultad().name());
        }
        
        dto.setMaxParticipantes(desafio.getMaxParticipantes());
        dto.setImagenUrl(desafio.getImagenUrl());
        
      
        if (desafio.getEstado() != null) {
            dto.setEstado(desafio.getEstado().name());
        }
        
        return dto;
    }
}