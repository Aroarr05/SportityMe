package com.aroa.sportifyme.seguridad.dto;

import lombok.Data;
import java.math.BigDecimal;

@Data
public class ProgresoDTO {
    private Long desafioId;
    private BigDecimal valorActual; 
    private String unidad;
    private String comentario;
    private String dispositivo;
}