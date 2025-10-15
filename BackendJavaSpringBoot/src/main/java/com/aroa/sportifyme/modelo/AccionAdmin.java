package com.aroa.sportifyme.modelo;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Entity
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "acciones_admin")
public class AccionAdmin {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "admin_id", nullable = false)
    private Usuario admin;

    @Enumerated(EnumType.STRING)
    @Column(name = "tipo_accion", nullable = false)
    private TipoAccion tipoAccion;

    @Column(name = "entidad_afectada", nullable = false, length = 100)
    private String entidadAfectada;

    @Column(name = "id_entidad_afectada")
    private Long idEntidadAfectada;

    @Column(columnDefinition = "TEXT")
    private String descripcion;

    @Column(name = "fecha_accion")
    private LocalDateTime fechaAccion;

    public enum TipoAccion {
        CREAR_DESAFIO,
        EDITAR_DESAFIO,
        ELIMINAR_DESAFIO,
        EDITAR_USUARIO,
        ELIMINAR_USUARIO
    }

    @PrePersist
    protected void onCreate() {
        if (fechaAccion == null) {
            fechaAccion = LocalDateTime.now();
        }
    }
}