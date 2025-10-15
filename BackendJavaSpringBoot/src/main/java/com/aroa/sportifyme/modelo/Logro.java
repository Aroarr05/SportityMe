package com.aroa.sportifyme.modelo;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "logros")
public class Logro {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String nombre;

    @Column(columnDefinition = "TEXT")
    private String descripcion;

    @Column(name = "icono_url", length = 255)
    private String iconoUrl;

    @Column(nullable = false, length = 50)
    private String criterio;

    @Column(name = "valor_requerido")
    private Integer valorRequerido;

    @Enumerated(EnumType.STRING)
    private CategoriaLogro categoria;

    public enum CategoriaLogro {
        PROGRESO,
        SOCIAL,
        DEDICACION
    }
}