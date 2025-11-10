package com.aroa.sportifyme.seguridad.dto;

import lombok.Data;
import java.math.BigDecimal;
import java.math.RoundingMode;
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
    
    private Boolean completado;
    private BigDecimal porcentajeCompletado;

    private DesafioDTO desafio;

    @Data
    public static class DesafioDTO {
        private Long id;
        private String titulo;
        private BigDecimal objetivo;
        private String unidadObjetivo;
        private LocalDateTime fechaInicio;
        private LocalDateTime fechaFin;
    }

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
        
        if (progreso.getDesafio() != null && progreso.getDesafio().getObjetivo() != null) {
            BigDecimal objetivo = progreso.getDesafio().getObjetivo();
            BigDecimal valorActual = progreso.getValorActual();
            
            if (objetivo.compareTo(BigDecimal.ZERO) > 0) {
                BigDecimal porcentaje = valorActual.divide(objetivo, 4, RoundingMode.HALF_UP)
                                                 .multiply(BigDecimal.valueOf(100))
                                                 .min(BigDecimal.valueOf(100));
                dto.setPorcentajeCompletado(porcentaje);
            } else {
                dto.setPorcentajeCompletado(BigDecimal.ZERO);
            }
            
            dto.setCompletado(valorActual.compareTo(objetivo) >= 0);

            DesafioDTO desafioDTO = new DesafioDTO();
            desafioDTO.setId(progreso.getDesafio().getId());
            desafioDTO.setTitulo(progreso.getDesafio().getTitulo());
            desafioDTO.setObjetivo(progreso.getDesafio().getObjetivo());
            desafioDTO.setUnidadObjetivo(progreso.getDesafio().getUnidadObjetivo());
            desafioDTO.setFechaInicio(progreso.getDesafio().getFechaInicio());
            desafioDTO.setFechaFin(progreso.getDesafio().getFechaFin());
            dto.setDesafio(desafioDTO);
        }
        
        return dto;
    }
}