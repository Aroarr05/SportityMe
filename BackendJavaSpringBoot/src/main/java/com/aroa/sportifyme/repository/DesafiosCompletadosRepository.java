
package com.aroa.sportifyme.repository;

import com.aroa.sportifyme.modelo.DesafiosCompletados;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface DesafiosCompletadosRepository extends JpaRepository<DesafiosCompletados, Long> {
    

    Integer countByUsuarioIdAndCompletadoTrue(Long usuarioId);
    
    List<DesafiosCompletados> findByDesafioIdAndCompletadoTrue(Long desafioId);

    @Query("SELECT COUNT(dc) FROM DesafiosCompletados dc WHERE dc.usuario.id = :usuarioId AND dc.completado = true")
    Integer countDesafiosCompletadosByUsuario(@Param("usuarioId") Long usuarioId);
    

    @Query("SELECT dc FROM DesafiosCompletados dc WHERE dc.desafio.id = :desafioId AND dc.completado = true ORDER BY dc.fechaCompletado ASC")
    List<DesafiosCompletados> findCompletadosByDesafioOrderByFecha(@Param("desafioId") Long desafioId);
    
    boolean existsByUsuarioIdAndDesafioIdAndCompletadoTrue(Long usuarioId, Long desafioId);
    
    Optional<DesafiosCompletados> findByUsuarioIdAndDesafioId(Long usuarioId, Long desafioId);
    
    List<DesafiosCompletados> findByUsuarioIdAndCompletadoTrue(Long usuarioId);
    
    @Query("SELECT dc FROM DesafiosCompletados dc WHERE dc.usuario.id = :usuarioId AND dc.completado = true")
    List<DesafiosCompletados> findDesafiosCompletadosByUsuario(@Param("usuarioId") Long usuarioId);
}