package com.aroa.sportifyme.seguridad.dto;

import com.aroa.sportifyme.modelo.Desafio;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class DesafioDTO {
    private Long id;
    private String titulo;
    private String descripcion;
    private String tipo_actividad;  
    private Double objetivo;
    private String unidad_objetivo; 
    private LocalDateTime fecha_inicio; 
    private LocalDateTime fecha_fin; 
    private Long creador_id; 
    private Boolean es_publico; 
    private String icono; 
    private String dificultad; 
    private Integer max_participantes; 
    private String estado;
    private LocalDateTime fecha_creacion;  
    private LocalDateTime fecha_actualizacion; 

    public static DesafioDTO fromEntity(Desafio desafio) {
        if (desafio == null) {
            return null;
        }
        
        DesafioDTO dto = new DesafioDTO();
        dto.setId(desafio.getId());
        dto.setTitulo(desafio.getTitulo());
        dto.setDescripcion(desafio.getDescripcion());
        
        if (desafio.getTipoActividad() != null) {
            dto.setTipo_actividad(desafio.getTipoActividad().name()); 
        }
        
        dto.setObjetivo(desafio.getObjetivo() != null ? desafio.getObjetivo().doubleValue() : null);
        dto.setUnidad_objetivo(desafio.getUnidadObjetivo());
        dto.setFecha_inicio(desafio.getFechaInicio()); 
        dto.setFecha_fin(desafio.getFechaFin());
        dto.setCreador_id(desafio.getCreador() != null ? desafio.getCreador().getId() : null); 
        dto.setEs_publico(desafio.getEsPublico()); 
        dto.setIcono(desafio.getIcono());
        
        if (desafio.getDificultad() != null) {
            dto.setDificultad(desafio.getDificultad().name());
        }
        
        dto.setMax_participantes(desafio.getMaxParticipantes()); 
        
        if (desafio.getEstado() != null) {
            dto.setEstado(desafio.getEstado().name());
        }
       
        dto.setFecha_creacion(desafio.getFechaCreacion()); 
        dto.setFecha_actualizacion(desafio.getFechaActualizacion()); 
        
        return dto;
    }
}