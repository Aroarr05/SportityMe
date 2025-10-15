package com.aroa.sportifyme.seguridad.dto.response;

import lombok.Data;

@Data
public class UsuarioResponse {
    private Long id;
    private String nombre;
    private String avatarUrl;
}