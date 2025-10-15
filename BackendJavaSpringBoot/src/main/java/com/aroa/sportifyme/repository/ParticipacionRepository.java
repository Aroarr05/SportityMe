package com.aroa.sportifyme.repository;

import com.aroa.sportifyme.modelo.Participacion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ParticipacionRepository extends JpaRepository<Participacion, Long> {
    boolean existsByUsuarioIdAndDesafioId(Long usuarioId, Long desafioId);
    List<Participacion> findByUsuarioId(Long usuarioId);
    List<Participacion> findByDesafioId(Long desafioId);

    @Query("SELECT COUNT(p) FROM Participacion p WHERE p.desafio.id = :desafioId")
    int countByDesafioId(@Param("desafioId") Long desafioId);

    @Query("SELECT p FROM Participacion p JOIN FETCH p.usuario WHERE p.id = :id")
    Optional<Participacion> findByIdWithUsuario(@Param("id") Long id);
}