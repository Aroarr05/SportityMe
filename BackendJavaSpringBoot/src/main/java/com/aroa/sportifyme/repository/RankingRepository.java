package com.aroa.sportifyme.repository;

import com.aroa.sportifyme.seguridad.dto.RankingDTO;
import com.aroa.sportifyme.modelo.Progreso;
import com.aroa.sportifyme.modelo.Usuario;


import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RankingRepository extends JpaRepository<Progreso, Long> {
   
    @Query("SELECT new com.aroa.sportifyme.seguridad.dto.RankingDTO(" +
           "u.id, u.nombre, MAX(p.valorActual), u.avatarUrl) " +
           "FROM Progreso p " +
           "JOIN p.usuario u " +
           "WHERE p.desafio.id = :desafioId " +
           "GROUP BY u.id, u.nombre, u.avatarUrl " +
           "ORDER BY MAX(p.valorActual) DESC")
    List<RankingDTO> findSimpleRankingByDesafioId(@Param("desafioId") Long desafioId);
    
    @Query("SELECT new com.aroa.sportifyme.seguridad.dto.RankingDTO(" +
           "u.id, u.nombre, COUNT(DISTINCT p.desafio.id), u.avatarUrl) " +
           "FROM Progreso p " +
           "JOIN p.usuario u " +
           "WHERE p.valorActual >= p.desafio.objetivo " +
           "GROUP BY u.id, u.nombre, u.avatarUrl " +
           "ORDER BY COUNT(DISTINCT p.desafio.id) DESC")
    List<RankingDTO> findGlobalRanking();
    
    @Query("SELECT COUNT(p) FROM Participacion p WHERE p.desafio.id = :desafioId")
    Long countParticipantesByDesafioId(@Param("desafioId") Long desafioId);
    
    @Query("SELECT CASE WHEN COUNT(p) > 0 THEN true ELSE false END FROM Participacion p WHERE p.desafio.id = :desafioId AND p.usuario.id = :usuarioId")
    boolean esParticipante(@Param("desafioId") Long desafioId, @Param("usuarioId") Long usuarioId);
  
    @Query("SELECT p.usuario FROM Participacion p WHERE p.desafio.id = :desafioId")
    List<Usuario> findParticipantesByDesafioId(@Param("desafioId") Long desafioId);
}