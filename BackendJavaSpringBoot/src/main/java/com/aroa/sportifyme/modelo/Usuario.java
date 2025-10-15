package com.aroa.sportifyme.modelo;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Data
@Entity
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "usuarios")
public class Usuario {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String nombre;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "rol_id", nullable = false)
    private Rol rol;

    @Column(nullable = false, unique = true, length = 100)
    private String email;

    @Column(name = "contraseña", nullable = false, length = 255)
    private String contraseña;

    @Column(name = "avatar_url", length = 255)
    private String avatarUrl;

    @Column(columnDefinition = "TEXT")
    private String biografia;

    @Column(length = 100)
    private String ubicacion;

    @Column(name = "fecha_nacimiento")
    private LocalDate fechaNacimiento;

    @Enumerated(EnumType.STRING)
    @Column(columnDefinition = "ENUM('MASCULINO', 'FEMENINO', 'OTRO', 'NO_ESPECIFICADO')")
    private Genero genero;

    @Column(precision = 5, scale = 2)
    private BigDecimal peso;

    @Column
    private Integer altura;

    @Column(name = "fecha_registro", nullable = false, updatable = false)
    private LocalDateTime fechaRegistro;

    @Column(name = "ultimo_login")
    private LocalDateTime ultimoLogin;

    @Column(name = "activo")
    @Builder.Default
    private Boolean activo = true;

    @OneToMany(mappedBy = "usuario", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<UsuarioLogro> logrosObtenidos = new ArrayList<>();

    @OneToMany(mappedBy = "usuario", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<Participacion> participaciones = new ArrayList<>();

    @OneToMany(mappedBy = "usuario", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<Progreso> progresos = new ArrayList<>();

    @OneToMany(mappedBy = "usuario", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<Comentario> comentarios = new ArrayList<>();

    @OneToMany(mappedBy = "admin", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<AccionAdmin> accionesAdmin = new ArrayList<>();

    @OneToMany(mappedBy = "creador", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<Desafio> desafiosCreados = new ArrayList<>();

    public enum Genero {
        MASCULINO,
        FEMENINO,
        OTRO,
        NO_ESPECIFICADO
    }

    @PrePersist
    protected void onCreate() {
        if (fechaRegistro == null) {
            fechaRegistro = LocalDateTime.now();
        }
        if (activo == null) {
            activo = true;
        }
    }
}