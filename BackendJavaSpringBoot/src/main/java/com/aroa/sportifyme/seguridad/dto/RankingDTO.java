package com.aroa.sportifyme.seguridad.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RankingDTO {
    private Long usuarioId;
    private String nombre;
    private String avatarUrl;
    private Long totalDesafios;
    private BigDecimal porcentajeCompletado;
    private BigDecimal valorActual;
    private Integer posicion;

    public RankingDTO(Long usuarioId, String nombre, String avatarUrl, Long totalDesafios, BigDecimal porcentajeCompletado) {
        this.usuarioId = usuarioId;
        this.nombre = nombre;
        this.avatarUrl = avatarUrl;
        this.totalDesafios = totalDesafios;
        this.porcentajeCompletado = porcentajeCompletado;
    }

    public RankingDTO(Long usuarioId, String nombre, String avatarUrl, BigDecimal valorActual, BigDecimal porcentajeCompletado) {
        this.usuarioId = usuarioId;
        this.nombre = nombre;
        this.avatarUrl = avatarUrl;
        this.valorActual = valorActual;
        this.porcentajeCompletado = porcentajeCompletado;
    }
}