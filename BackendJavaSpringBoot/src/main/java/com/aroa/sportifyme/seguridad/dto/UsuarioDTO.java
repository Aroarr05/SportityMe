package com.aroa.sportifyme.seguridad.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import jakarta.validation.constraints.Pattern;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
public class UsuarioDTO {
    private Long id;
    private LocalDateTime fechaRegistro;
    private LocalDateTime ultimoLogin;
    private String rol;

    @NotBlank(message = "El nombre es obligatorio")
    @Size(max = 100, message = "El nombre no puede exceder los 100 caracteres")
    private String nombre;

    @NotBlank(message = "El email es obligatorio")
    @Email(message = "Debe ser un email válido")
    private String email;

    @NotBlank(message = "La contraseña es obligatoria")
    @Size(min = 6, message = "La contraseña debe tener al menos 6 caracteres")
    private String contraseña; 
    private String avatarUrl;
    
    @Size(max = 500, message = "La biografía no puede exceder los 500 caracteres")
    private String biografia;
    
    @Size(max = 100, message = "La ubicación no puede exceder los 100 caracteres")
    private String ubicacion;
    
    private LocalDate fechaNacimiento;
    
    @Pattern(regexp = "^(masculino|femenino|otro|no_especificado)$", 
             message = "El género debe ser: masculino, femenino, otro o no_especificado")
    private String genero;
    
    private Double peso;
    
    private Integer altura;

    public UsuarioDTO(Long id, String nombre, String email, String avatarUrl, String rol) {
        this.id = id;
        this.nombre = nombre;
        this.email = email;
        this.avatarUrl = avatarUrl;
        this.rol = rol;
    }

    public boolean esParaRegistro() {
        return this.contraseña != null && !this.contraseña.trim().isEmpty();
    }

    public boolean tieneDatosPerfil() {
        return this.biografia != null || this.ubicacion != null || 
               this.fechaNacimiento != null || this.genero != null ||
               this.peso != null || this.altura != null;
    }
    
    public void limpiarParaActualizacion() {
        this.contraseña = null;
        this.rol = null;
        this.fechaRegistro = null;
        this.ultimoLogin = null;
    }
}