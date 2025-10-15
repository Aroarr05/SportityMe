package com.aroa.sportifyme.repository;

import com.aroa.sportifyme.modelo.Logro;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface LogroRepository extends JpaRepository<Logro, Long> {
    Optional<Logro> findByCriterio(String criterio);
    boolean existsByCriterio(String criterio);
}