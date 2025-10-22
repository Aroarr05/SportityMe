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
    private Long totalDesafiosCompletados; 
    private BigDecimal progresoActual;
    private Integer posicion; 
    
    public RankingDTO(Long usuarioId, String nombre, String avatarUrl, Long totalDesafiosCompletados) {
        this.usuarioId = usuarioId;
        this.nombre = nombre;
        this.avatarUrl = avatarUrl;
        this.totalDesafiosCompletados = totalDesafiosCompletados;
    }
   
    public RankingDTO(Long usuarioId, String nombre, String avatarUrl, BigDecimal progresoActual) {
        this.usuarioId = usuarioId;
        this.nombre = nombre;
        this.avatarUrl = avatarUrl;
        this.progresoActual = progresoActual;
    }
    
    
    public BigDecimal getValorOrdenamiento() {
        if (progresoActual != null) {
            return progresoActual;
        } else if (totalDesafiosCompletados != null) {
            return new BigDecimal(totalDesafiosCompletados);
        }
        return BigDecimal.ZERO;
    }
}