package com.aroa.sportifyme.modelo;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Data
@Entity
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "desafios")
public class Desafio {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String titulo;

    private String descripcion;

    @Enumerated(EnumType.STRING)
    @Column(name = "tipo_actividad", nullable = false)
    private TipoActividad tipoActividad;

    @Column(precision = 10, scale = 2)
    private BigDecimal objetivo;

    @Column(name = "unidad_objetivo")
    private String unidadObjetivo;

    @Column(name = "fecha_inicio", nullable = false)
    private LocalDateTime fechaInicio;

    @Column(name = "fecha_fin", nullable = false)
    private LocalDateTime fechaFin;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "creador_id", nullable = false)
    private Usuario creador;

    @Column(name = "es_publico")
    @Builder.Default 
    private Boolean esPublico = true;

    @Column(name = "imagen_url")
    private String imagenUrl;

    @Enumerated(EnumType.STRING)
    private Dificultad dificultad;

    @Column(name = "max_participantes")
    private Integer maxParticipantes;

    @OneToMany(mappedBy = "desafio", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @Builder.Default  
    private Set<Participacion> participaciones = new HashSet<>();

    public Set<Usuario> getParticipantes() {
        Set<Usuario> participantes = new HashSet<>();
        for (Participacion participacion : this.participaciones) {
            participantes.add(participacion.getUsuario());
        }
        return participantes;
    }

    public void agregarParticipante(Usuario usuario) {
        Participacion participacion = Participacion.builder()
                .usuario(usuario)
                .desafio(this)
                .fechaUnion(LocalDateTime.now())
                .build();
        this.participaciones.add(participacion);
    }

    public enum TipoActividad {
        correr, ciclismo, nadar, gimnasio, senderismo, yoga, otro
    }

    public enum Dificultad {
        principiante, intermedio, avanzado
    }
}