package com.aroa.sportifyme.seguridad.dto.request;

import com.aroa.sportifyme.modelo.DificultadDesafio;
import com.aroa.sportifyme.modelo.TipoActividad;
import lombok.Data;
import jakarta.validation.constraints.*;
import java.time.LocalDateTime;

@Data
public class DesafioRequest {
    @NotBlank(message = "El título es obligatorio")
    @Size(max = 100, message = "Máximo 100 caracteres")
    private String titulo;

    private String descripcion;

    @NotNull(message = "El tipo de actividad es obligatorio")
    private TipoActividad tipoActividad;

    @PositiveOrZero(message = "El objetivo debe ser positivo")
    private Double objetivo;

    private String unidadObjetivo;

    @NotNull(message = "La fecha de inicio es obligatoria")
    @FutureOrPresent(message = "La fecha debe ser presente o futura")
    private LocalDateTime fechaInicio;

    @NotNull(message = "La fecha de fin es obligatoria")
    @Future(message = "La fecha debe ser futura")
    private LocalDateTime fechaFin;

    private Boolean esPublico = true;

    private DificultadDesafio dificultad;

    @Positive(message = "El máximo de participantes debe ser positivo")
    private Integer maxParticipantes;
}