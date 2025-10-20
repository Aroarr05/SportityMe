package com.aroa.sportifyme.repository;

import com.aroa.sportifyme.modelo.Progreso;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface ProgresoRepository extends JpaRepository<Progreso, Long> {

    List<Progreso> findByDesafioId(Long desafioId);
    List<Progreso> findByUsuarioIdOrderByFechaRegistroDesc(Long usuarioId);
    List<Progreso> findByUsuarioIdAndDesafioId(Long usuarioId, Long desafioId);
    
    void deleteByUsuarioIdAndDesafioId(Long usuarioId, Long desafioId);

    @Query("SELECT p FROM Progreso p JOIN FETCH p.usuario JOIN FETCH p.desafio " +
           "WHERE p.desafio.id = :desafioId ORDER BY p.fechaRegistro DESC")
    List<Progreso> findByDesafioIdWithUsuarioAndDesafio(@Param("desafioId") Long desafioId);

    @Query("SELECT p FROM Progreso p JOIN FETCH p.usuario " +
           "WHERE p.desafio.id = :desafioId " +
           "ORDER BY p.valorActual DESC")
    List<Progreso> findRankingByDesafioId(@Param("desafioId") Long desafioId);

    @Query("SELECT p FROM Progreso p JOIN FETCH p.usuario JOIN FETCH p.desafio WHERE p.id = :id")
    Optional<Progreso> findByIdWithUsuarioAndDesafio(@Param("id") Long id);

    @Query("SELECT p FROM Progreso p WHERE p.usuario.id = :usuarioId AND p.desafio.id = :desafioId " +
           "ORDER BY p.fechaRegistro DESC LIMIT 1")
    Optional<Progreso> findLatestByUsuarioAndDesafio(@Param("usuarioId") Long usuarioId, 
                                                     @Param("desafioId") Long desafioId);

    @Query("SELECT p FROM Progreso p WHERE p.usuario.id = :usuarioId AND p.desafio.id = :desafioId " +
           "ORDER BY p.valorActual DESC LIMIT 1")
    Optional<Progreso> findMaxProgresoByUsuarioAndDesafio(@Param("usuarioId") Long usuarioId, 
                                                          @Param("desafioId") Long desafioId);

    Optional<Progreso> findFirstByUsuarioIdAndDesafioIdOrderByValorActualDesc(Long usuarioId, Long desafioId);

    @Query("SELECT COUNT(p) > 0 FROM Progreso p " +
           "WHERE p.usuario.id = :usuarioId AND p.desafio.id = :desafioId")
    boolean existsByUsuarioAndDesafio(@Param("usuarioId") Long usuarioId,
                                      @Param("desafioId") Long desafioId);

    @Query("SELECT COUNT(p) FROM Progreso p WHERE p.usuario.id = :usuarioId")
    Long countByUsuarioId(@Param("usuarioId") Long usuarioId);

    @Query("SELECT COUNT(p) FROM Progreso p WHERE p.desafio.id = :desafioId")
    Long countByDesafioId(@Param("desafioId") Long desafioId);

    @Query("SELECT COUNT(DISTINCT p.desafio.id) FROM Progreso p " +
           "WHERE p.usuario.id = :usuarioId AND p.valorActual >= p.desafio.objetivo")
    Integer countDesafiosCompletadosByUsuario(@Param("usuarioId") Long usuarioId);

    @Query("SELECT (MAX(p.valorActual) / d.objetivo * 100) FROM Progreso p " +
           "JOIN p.desafio d " +
           "WHERE p.usuario.id = :usuarioId AND p.desafio.id = :desafioId " +
           "GROUP BY d.objetivo")
    Optional<BigDecimal> calcularProgresoUsuarioDesafio(@Param("usuarioId") Long usuarioId, 
                                                        @Param("desafioId") Long desafioId);

    @Query("SELECT p FROM Progreso p JOIN FETCH p.usuario JOIN FETCH p.desafio " +
           "WHERE p.fechaRegistro BETWEEN :startDate AND :endDate " +
           "ORDER BY p.fechaRegistro DESC")
    List<Progreso> findByFechaRegistroBetween(@Param("startDate") LocalDateTime startDate, 
                                              @Param("endDate") LocalDateTime endDate);

    @Query("SELECT p FROM Progreso p JOIN FETCH p.desafio " +
           "WHERE p.usuario.id = :usuarioId AND p.fechaRegistro BETWEEN :startDate AND :endDate " +
           "ORDER BY p.fechaRegistro DESC")
    List<Progreso> findByUsuarioIdAndFechaRegistroBetween(@Param("usuarioId") Long usuarioId, 
                                                          @Param("startDate") LocalDateTime startDate, 
                                                          @Param("endDate") LocalDateTime endDate);

    @Query("SELECT COALESCE(SUM(p.valorActual), 0) FROM Progreso p " +
           "WHERE p.usuario.id = :usuarioId AND p.desafio.id = :desafioId")
    Double sumProgresoByUsuarioAndDesafio(@Param("usuarioId") Long usuarioId, 
                                          @Param("desafioId") Long desafioId);

    @Query("SELECT p FROM Progreso p JOIN FETCH p.usuario JOIN FETCH p.desafio " +
           "WHERE p.dispositivo = :dispositivo ORDER BY p.fechaRegistro DESC")
    List<Progreso> findByDispositivo(@Param("dispositivo") String dispositivo);
}