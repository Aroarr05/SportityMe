package com.aroa.sportifyme.modelo;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Data
@Entity
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "desafios_completados")
public class DesafiosCompletados {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "usuario_id", nullable = false)
    private Usuario usuario;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "desafio_id", nullable = false)
    private Desafio desafio;

    @Column(name = "fecha_completado")
    @Builder.Default
    private LocalDateTime fechaCompletado = LocalDateTime.now();

    @Column(name = "completado")
    @Builder.Default
    private Boolean completado = true;
}