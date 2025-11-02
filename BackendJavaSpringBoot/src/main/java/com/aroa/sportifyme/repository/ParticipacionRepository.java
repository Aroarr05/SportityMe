package com.aroa.sportifyme.repository;

import com.aroa.sportifyme.modelo.Participacion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ParticipacionRepository extends JpaRepository<Participacion, Long> {
    boolean existsByUsuarioIdAndDesafioId(Long usuarioId, Long desafioId);
    void deleteByUsuarioIdAndDesafioId(Long usuarioId, Long desafioId);
    long countByDesafioId(Long desafioId);
}