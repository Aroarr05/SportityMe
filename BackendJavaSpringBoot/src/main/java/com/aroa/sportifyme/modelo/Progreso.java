package com.aroa.sportifyme.modelo;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;


@Entity
@Table(name = "progresos")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Progreso {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "usuario_id")
    private Usuario usuario;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "desafio_id")
    private Desafio desafio;
    
    @Column(name = "valor_actual", precision = 10, scale = 2)
    private BigDecimal valorActual;
    
    @Column(name = "unidad")
    private String unidad;
    
    @Column(name = "fecha_registro")
    private LocalDateTime fechaRegistro;
    
    @Column(name = "comentario")
    private String comentario;
    
    @Column(name = "dispositivo")
    private String dispositivo;
}