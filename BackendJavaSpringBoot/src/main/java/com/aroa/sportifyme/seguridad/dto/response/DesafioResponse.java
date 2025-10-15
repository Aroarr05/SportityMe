package com.aroa.sportifyme.seguridad.dto.response;

import com.aroa.sportifyme.modelo.DificultadDesafio;
import com.aroa.sportifyme.modelo.TipoActividad;
import lombok.Data;
import java.time.LocalDateTime;

@Data
public class DesafioResponse {
    private Long id;
    private String titulo;
    private String descripcion;
    private TipoActividad tipoActividad;
    private Double objetivo;
    private String unidadObjetivo;
    private LocalDateTime fechaInicio;
    private LocalDateTime fechaFin;
    private UsuarioResponse creador;
    private Boolean esPublico;
    private String imagenUrl;
    private DificultadDesafio dificultad;
    private Integer maxParticipantes;
}