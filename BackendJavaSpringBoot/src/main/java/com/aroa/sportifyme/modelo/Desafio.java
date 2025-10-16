package com.aroa.sportifyme.modelo;

import lombok.Data;
import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Data
@Entity
@Table(name = "desafios")
public class Desafio {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String titulo;

    @Column(columnDefinition = "TEXT")
    private String descripcion;

    @Enumerated(EnumType.STRING)
    @Column(name = "tipo_actividad", nullable = false)
    private TipoActividad tipoActividad;

    @Column(precision = 10, scale = 2)
    private BigDecimal objetivo;

    @Column(name = "unidad_objetivo", length = 20)
    private String unidadObjetivo;

    @Column(name = "fecha_inicio", nullable = false)
    private LocalDateTime fechaInicio;

    @Column(name = "fecha_fin", nullable = false)
    private LocalDateTime fechaFin;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "creador_id", nullable = false)
    private Usuario creador;

    @Column(name = "es_publico")
    private Boolean esPublico = true;

    @Column(length = 255)
    private String imagenUrl;

    @Enumerated(EnumType.STRING)
    private Dificultad dificultad;

    @Column(name = "max_participantes")
    private Integer maxParticipantes;

    @Enumerated(EnumType.STRING)
    private Estado estado = Estado.ACTIVO;

    @Column(name = "fecha_creacion")
    private LocalDateTime fechaCreacion = LocalDateTime.now();

    @Column(name = "fecha_actualizacion")
    private LocalDateTime fechaActualizacion = LocalDateTime.now();

    @ManyToMany
    @JoinTable(
        name = "participaciones",
        joinColumns = @JoinColumn(name = "desafio_id"),
        inverseJoinColumns = @JoinColumn(name = "usuario_id")
    )
    private List<Usuario> participantes = new ArrayList<>();

    // Enums
    public enum TipoActividad {
        correr, ciclismo, natacion, gimnasio, otros
    }

    public enum Dificultad {
        PRINCIPIANTE, INTERMEDIO, AVANZADO
    }

    public enum Estado {
        ACTIVO, INACTIVO, ELIMINADO
    }

    public void agregarParticipante(Usuario usuario) {
        if (!this.participantes.contains(usuario)) {
            this.participantes.add(usuario);
        }
    }

    @PreUpdate
    public void preUpdate() {
        this.fechaActualizacion = LocalDateTime.now();
    }
}