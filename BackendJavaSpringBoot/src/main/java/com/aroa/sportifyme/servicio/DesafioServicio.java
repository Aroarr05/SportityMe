package com.aroa.sportifyme.servicio;

import com.aroa.sportifyme.exception.*;
import com.aroa.sportifyme.modelo.*;
import com.aroa.sportifyme.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class DesafioServicio {

    private final DesafioRepository desafioRepository;
    private final UsuarioServicio usuarioServicio;

    @Transactional
    public Desafio crearDesafio(String titulo, String descripcion, Desafio.TipoActividad tipoActividad,
                               BigDecimal objetivo, String unidadObjetivo, LocalDateTime fechaInicio,
                               LocalDateTime fechaFin, Boolean esPublico, Desafio.Dificultad dificultad,
                               Integer maxParticipantes, Long creadorId) {
        Usuario creador = usuarioServicio.buscarPorId(creadorId)
                .orElseThrow(() -> new UsuarioNoEncontradoException(creadorId));

        validarFechas(fechaInicio, fechaFin);

        Desafio desafio = Desafio.builder()
                .titulo(titulo)
                .descripcion(descripcion)
                .tipoActividad(tipoActividad)
                .objetivo(objetivo)
                .unidadObjetivo(unidadObjetivo)
                .fechaInicio(fechaInicio)
                .fechaFin(fechaFin)
                .esPublico(esPublico)
                .dificultad(dificultad)
                .maxParticipantes(maxParticipantes)
                .creador(creador)
                .build();

        return desafioRepository.save(desafio);
    }

    @Transactional(readOnly = true)
    public Desafio buscarPorId(Long id) {
        return desafioRepository.findById(id)
                .orElseThrow(() -> new DesafioNoEncontradoException(id));
    }

    @Transactional(readOnly = true)
    public Optional<Desafio> buscarPorIdOptional(Long id) {
        return desafioRepository.findById(id);
    }

    @Transactional(readOnly = true)
    public List<Desafio> listarPorCreador(Long creadorId) {
        Usuario creador = usuarioServicio.buscarPorId(creadorId)
                .orElseThrow(() -> new UsuarioNoEncontradoException(creadorId));
        return desafioRepository.findByCreadorOrderByFechaInicioDesc(creador);
    }

    @Transactional(readOnly = true)
    public List<Desafio> listarDesafiosActivos() {
        return desafioRepository.findByEsPublicoTrueAndFechaFinAfterOrderByFechaInicioAsc(LocalDateTime.now());
    }

    @Transactional(readOnly = true)
    public List<Desafio> listarTodos() {
        return desafioRepository.findAllByOrderByFechaInicioDesc();
    }

    @Transactional
    public Desafio actualizarDesafio(Long id, String titulo, String descripcion, Desafio.TipoActividad tipoActividad,
                                    BigDecimal objetivo, String unidadObjetivo, LocalDateTime fechaInicio,
                                    LocalDateTime fechaFin, Boolean esPublico, Desafio.Dificultad dificultad,
                                    Integer maxParticipantes, Long usuarioId) {
        Desafio desafioExistente = buscarPorId(id);
        Usuario usuario = usuarioServicio.buscarPorId(usuarioId)
                .orElseThrow(() -> new UsuarioNoEncontradoException(usuarioId));

        validarFechas(fechaInicio, fechaFin);

        if (!tienePermisosParaModificar(desafioExistente, usuario)) {
            throw new AccesoNoAutorizadoException("actualizar", "desafío", id);
        }

        desafioExistente.setTitulo(titulo);
        desafioExistente.setDescripcion(descripcion);
        desafioExistente.setTipoActividad(tipoActividad);
        desafioExistente.setObjetivo(objetivo);
        desafioExistente.setUnidadObjetivo(unidadObjetivo);
        desafioExistente.setFechaInicio(fechaInicio);
        desafioExistente.setFechaFin(fechaFin);
        desafioExistente.setEsPublico(esPublico);
        desafioExistente.setDificultad(dificultad);
        desafioExistente.setMaxParticipantes(maxParticipantes);

        return desafioRepository.save(desafioExistente);
    }

    @Transactional
    public void eliminarDesafio(Long id, Long usuarioId) {
        Desafio desafio = buscarPorId(id);
        Usuario usuario = usuarioServicio.buscarPorId(usuarioId)
                .orElseThrow(() -> new UsuarioNoEncontradoException(usuarioId));

        if (!tienePermisosParaModificar(desafio, usuario)) {
            throw new AccesoNoAutorizadoException("eliminar", "desafío", id);
        }

        desafioRepository.delete(desafio);
    }

    @Transactional(readOnly = true)
    public boolean existeDesafio(Long id) {
        return desafioRepository.existsById(id);
    }

    @Transactional
    public void unirseADesafio(Long desafioId, Long usuarioId) {
        Desafio desafio = buscarPorId(desafioId);
        Usuario usuario = usuarioServicio.buscarPorId(usuarioId)
                .orElseThrow(() -> new UsuarioNoEncontradoException(usuarioId));
        
        if (desafioRepository.esParticipante(desafioId, usuarioId)) {
            throw new IllegalArgumentException("Ya eres participante de este desafío");
        }
        
        if (desafio.getMaxParticipantes() != null) {
            Long participantesActuales = desafioRepository.countParticipantesByDesafioId(desafioId);
            if (participantesActuales >= desafio.getMaxParticipantes()) {
                throw new IllegalArgumentException("El desafío ha alcanzado el máximo de participantes");
            }
        }
        
        if (desafio.getFechaFin().isBefore(LocalDateTime.now())) {
            throw new IllegalArgumentException("El desafío ya ha expirado");
        }
        
        if (desafio.getCreador().getId().equals(usuarioId)) {
            throw new IllegalArgumentException("El creador no puede unirse como participante");
        }
        
        desafio.agregarParticipante(usuario);
        desafioRepository.save(desafio);
    }

    @Transactional(readOnly = true)
    public List<Usuario> obtenerParticipantesDesafio(Long desafioId) {
        if (!desafioRepository.existsById(desafioId)) {
            throw new DesafioNoEncontradoException(desafioId);
        }
        
        return desafioRepository.findParticipantesByDesafioId(desafioId);
    }

    private void validarFechas(LocalDateTime fechaInicio, LocalDateTime fechaFin) {
        if (fechaFin.isBefore(fechaInicio)) {
            throw new IllegalArgumentException("La fecha de fin debe ser posterior a la de inicio");
        }
    }

    private boolean tienePermisosParaModificar(Desafio desafio, Usuario usuario) {
        return desafio.getCreador().equals(usuario) ||
                usuario.getRol() == Usuario.RolUsuario.admin;
    }
}