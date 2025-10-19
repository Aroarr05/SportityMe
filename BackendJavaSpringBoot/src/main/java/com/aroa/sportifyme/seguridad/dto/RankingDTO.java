package com.aroa.sportifyme.seguridad.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RankingDTO {
    private Long usuarioId;
    private String nombre;
    private String avatarUrl;
    private Integer totalDesafiosCompletados;
}