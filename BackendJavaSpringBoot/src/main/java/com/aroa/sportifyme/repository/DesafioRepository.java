package com.aroa.sportifyme.repository;

import com.aroa.sportifyme.modelo.Desafio;
import com.aroa.sportifyme.modelo.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface DesafioRepository extends JpaRepository<Desafio, Long> {

    List<Desafio> findByCreadorOrderByFechaInicioDesc(Usuario creador);

    List<Desafio> findByEsPublicoTrueAndFechaFinAfterOrderByFechaInicioAsc(LocalDateTime fecha);

    List<Desafio> findAllByOrderByFechaInicioDesc();

    @Query("SELECT p.usuario FROM Participacion p WHERE p.desafio.id = :desafioId")
    List<Usuario> findParticipantesByDesafioId(@Param("desafioId") Long desafioId);

    @Query("SELECT COUNT(p) FROM Participacion p WHERE p.desafio.id = :desafioId")
    Long countParticipantesByDesafioId(@Param("desafioId") Long desafioId);

    @Query("SELECT CASE WHEN COUNT(p) > 0 THEN true ELSE false END FROM Participacion p WHERE p.desafio.id = :desafioId AND p.usuario.id = :usuarioId")
    boolean esParticipante(@Param("desafioId") Long desafioId, @Param("usuarioId") Long usuarioId);

    @Repository
    public interface DesafioRepositorio extends JpaRepository<Desafio, Long> {
    }
}