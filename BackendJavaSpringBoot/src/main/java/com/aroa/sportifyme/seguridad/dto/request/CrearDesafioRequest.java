package com.aroa.sportifyme.seguridad.dto.request;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class CrearDesafioRequest {
    private String titulo;
    private String descripcion;
    private String tipo_actividad;  
    private Double objetivo;
    private String unidad_objetivo; 
    private LocalDateTime fecha_inicio;
    private LocalDateTime fecha_fin;
    private Boolean es_publico;
    private String icono;
    private String dificultad;     
    private Integer max_participantes;

}