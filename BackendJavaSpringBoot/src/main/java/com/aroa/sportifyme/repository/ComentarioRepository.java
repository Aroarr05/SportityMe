package com.aroa.sportifyme.repository;

import com.aroa.sportifyme.modelo.Comentario;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ComentarioRepository extends JpaRepository<Comentario, Long> {
    List<Comentario> findByDesafioIdOrderByFechaCreacionDesc(Long desafioId);
    List<Comentario> findByUsuarioId(Long usuarioId);
}