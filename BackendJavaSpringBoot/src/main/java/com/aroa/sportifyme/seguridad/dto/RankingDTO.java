// RankingDTO.java
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
    private Integer totalDesafiosCompletados;
    private BigDecimal progresoActual;
    private Integer posicion; 
    
    public RankingDTO(Long usuarioId, String nombre, String avatarUrl, Integer totalDesafiosCompletados) {
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
}