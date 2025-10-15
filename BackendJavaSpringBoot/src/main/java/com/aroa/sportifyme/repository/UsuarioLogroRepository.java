package com.aroa.sportifyme.repository;

import com.aroa.sportifyme.modelo.UsuarioLogro;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;

public interface UsuarioLogroRepository extends JpaRepository<UsuarioLogro, Long> {
    List<UsuarioLogro> findByUsuarioId(Long usuarioId);

    @Query("SELECT ul FROM UsuarioLogro ul WHERE ul.usuario.id = :usuarioId AND ul.logro.criterio = :criterio")
    boolean existsByUsuarioIdAndLogroCriterio(@Param("usuarioId") Long usuarioId,
                                              @Param("criterio") String criterio);
}