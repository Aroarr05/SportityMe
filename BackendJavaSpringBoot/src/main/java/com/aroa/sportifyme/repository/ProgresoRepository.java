package com.aroa.sportifyme.repository;

import com.aroa.sportifyme.modelo.Progreso;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Repository
public interface ProgresoRepository extends JpaRepository<Progreso, Long> {

    List<Progreso> findByUsuarioIdOrderByFechaRegistroDesc(Long usuarioId);

    List<Progreso> findByUsuarioIdAndDesafioIdOrderByFechaRegistroDesc(Long usuarioId, Long desafioId);

    @Query("SELECT SUM(p.valorActual) FROM Progreso p WHERE p.usuario.id = :usuarioId AND p.desafio.id = :desafioId")
    Optional<BigDecimal> findTotalProgresoByUsuarioAndDesafio(@Param("usuarioId") Long usuarioId,
            @Param("desafioId") Long desafioId);

    @Query("SELECT p FROM Progreso p WHERE p.usuario.id = :usuarioId AND p.desafio.id = :desafioId ORDER BY p.fechaRegistro DESC")
    List<Progreso> findUltimoProgreso(@Param("usuarioId") Long usuarioId,
            @Param("desafioId") Long desafioId);

    @Query("SELECT p FROM Progreso p WHERE p.id = :id AND p.usuario.id = :usuarioId")
    Optional<Progreso> findByIdAndUsuarioId(@Param("id") Long id, @Param("usuarioId") Long usuarioId);
}