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

    // ==================== MÉTODOS PARA EL ADMIN CONTROLLER ====================

    @Transactional(readOnly = true)
    public Optional<Desafio> obtenerDesafioPorId(Long id) {
        return desafioRepository.findById(id);
    }

    @Transactional(readOnly = true)
    public List<Desafio> obtenerTodosDesafios() {
        return desafioRepository.findAll();
    }

    @Transactional
    public Desafio crearDesafio(Desafio desafio) {
        if (desafio.getTitulo() == null || desafio.getTitulo().trim().isEmpty()) {
            throw new IllegalArgumentException("El título es obligatorio");
        }
        if (desafio.getCreador() == null || desafio.getCreador().getId() == null) {
            throw new IllegalArgumentException("El creador es obligatorio");
        }
        if (desafio.getFechaInicio() == null || desafio.getFechaFin() == null) {
            throw new IllegalArgumentException("Las fechas de inicio y fin son obligatorias");
        }

        validarFechas(desafio.getFechaInicio(), desafio.getFechaFin());


        if (desafio.getEsPublico() == null) {
            desafio.setEsPublico(true);
        }
        if (desafio.getEstado() == null) {
            desafio.setEstado(Desafio.Estado.ACTIVO);
        }
        if (desafio.getFechaCreacion() == null) {
            desafio.setFechaCreacion(LocalDateTime.now());
        }
        if (desafio.getFechaActualizacion() == null) {
            desafio.setFechaActualizacion(LocalDateTime.now());
        }
        if (desafio.getDificultad() == null) {
            desafio.setDificultad(Desafio.Dificultad.INTERMEDIO);
        }

        return desafioRepository.save(desafio);
    }

    @Transactional
    public Desafio actualizarDesafio(Desafio desafio) {
       
        Desafio desafioExistente = desafioRepository.findById(desafio.getId())
                .orElseThrow(() -> new DesafioNoEncontradoException(desafio.getId()));

      
        if (desafio.getFechaInicio() != null && desafio.getFechaFin() != null) {
            validarFechas(desafio.getFechaInicio(), desafio.getFechaFin());
        }

      
        if (desafio.getTitulo() != null) {
            desafioExistente.setTitulo(desafio.getTitulo());
        }
        if (desafio.getDescripcion() != null) {
            desafioExistente.setDescripcion(desafio.getDescripcion());
        }
        if (desafio.getTipoActividad() != null) {
            desafioExistente.setTipoActividad(desafio.getTipoActividad());
        }
        if (desafio.getObjetivo() != null) {
            desafioExistente.setObjetivo(desafio.getObjetivo());
        }
        if (desafio.getUnidadObjetivo() != null) {
            desafioExistente.setUnidadObjetivo(desafio.getUnidadObjetivo());
        }
        if (desafio.getFechaInicio() != null) {
            desafioExistente.setFechaInicio(desafio.getFechaInicio());
        }
        if (desafio.getFechaFin() != null) {
            desafioExistente.setFechaFin(desafio.getFechaFin());
        }
        if (desafio.getEsPublico() != null) {
            desafioExistente.setEsPublico(desafio.getEsPublico());
        }
        if (desafio.getIcono() != null) {
            desafioExistente.setIcono(desafio.getIcono());
        }
        if (desafio.getDificultad() != null) {
            desafioExistente.setDificultad(desafio.getDificultad());
        }
        if (desafio.getMaxParticipantes() != null) {
            desafioExistente.setMaxParticipantes(desafio.getMaxParticipantes());
        }
        if (desafio.getEstado() != null) {
            desafioExistente.setEstado(desafio.getEstado());
        }

        desafioExistente.setFechaActualizacion(LocalDateTime.now());

        return desafioRepository.save(desafioExistente);
    }

    @Transactional
    public void eliminarDesafio(Long id) {
        if (!desafioRepository.existsById(id)) {
            throw new DesafioNoEncontradoException(id);
        }
        desafioRepository.deleteById(id);
    }

    // ==================== MÉTODOS EXISTENTES (los mantienes) ====================

    @Transactional
    public Desafio crearDesafio(String titulo, String descripcion, Desafio.TipoActividad tipoActividad,
            Double objetivo, String unidadObjetivo, LocalDateTime fechaInicio,
            LocalDateTime fechaFin, Boolean esPublico, String icono, Desafio.Dificultad dificultad,
            Integer maxParticipantes, Long creadorId) {
        Usuario creador = usuarioServicio.buscarPorId(creadorId)
                .orElseThrow(() -> new UsuarioNoEncontradoException(creadorId));

        validarFechas(fechaInicio, fechaFin);

        Desafio desafio = new Desafio();
        desafio.setTitulo(titulo);
        desafio.setDescripcion(descripcion);
        desafio.setTipoActividad(tipoActividad);
        desafio.setObjetivo(objetivo != null ? BigDecimal.valueOf(objetivo) : null);
        desafio.setUnidadObjetivo(unidadObjetivo);
        desafio.setFechaInicio(fechaInicio);
        desafio.setFechaFin(fechaFin);
        desafio.setEsPublico(esPublico != null ? esPublico : true);
        desafio.setIcono(icono);
        desafio.setDificultad(dificultad);
        desafio.setMaxParticipantes(maxParticipantes);
        desafio.setCreador(creador);
        desafio.setEstado(Desafio.Estado.ACTIVO);
        desafio.setFechaCreacion(LocalDateTime.now());
        desafio.setFechaActualizacion(LocalDateTime.now());

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
            Double objetivo, String unidadObjetivo, LocalDateTime fechaInicio,
            LocalDateTime fechaFin, Boolean esPublico, String icono, Desafio.Dificultad dificultad,
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
        desafioExistente.setObjetivo(objetivo != null ? BigDecimal.valueOf(objetivo) : null);
        desafioExistente.setUnidadObjetivo(unidadObjetivo);
        desafioExistente.setFechaInicio(fechaInicio);
        desafioExistente.setFechaFin(fechaFin);
        desafioExistente.setEsPublico(esPublico);
        desafioExistente.setIcono(icono);
        desafioExistente.setDificultad(dificultad);
        desafioExistente.setMaxParticipantes(maxParticipantes);
        desafioExistente.setFechaActualizacion(LocalDateTime.now());

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

    @Transactional
    public void eliminarDesafioLogicamente(Long id, Long usuarioId) {
        Desafio desafio = buscarPorId(id);
        Usuario usuario = usuarioServicio.buscarPorId(usuarioId)
                .orElseThrow(() -> new UsuarioNoEncontradoException(usuarioId));

        if (!tienePermisosParaModificar(desafio, usuario)) {
            throw new AccesoNoAutorizadoException("eliminar", "desafío", id);
        }

        desafio.setEstado(Desafio.Estado.ELIMINADO);
        desafio.setFechaActualizacion(LocalDateTime.now());
        desafioRepository.save(desafio);
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

    @Transactional(readOnly = true)
    public boolean esParticipante(Long desafioId, Long usuarioId) {
        return desafioRepository.esParticipante(desafioId, usuarioId);
    }

    @Transactional(readOnly = true)
    public Long contarParticipantes(Long desafioId) {
        return desafioRepository.countParticipantesByDesafioId(desafioId);
    }

    private void validarFechas(LocalDateTime fechaInicio, LocalDateTime fechaFin) {
        if (fechaInicio == null || fechaFin == null) {
            throw new IllegalArgumentException("Las fechas de inicio y fin son requeridas");
        }

        if (fechaFin.isBefore(fechaInicio)) {
            throw new IllegalArgumentException("La fecha de fin debe ser posterior a la de inicio");
        }
    }

    private boolean tienePermisosParaModificar(Desafio desafio, Usuario usuario) {
        if (desafio.getCreador() == null || usuario.getRol() == null) {
            return false;
        }

        boolean esCreador = desafio.getCreador().getId().equals(usuario.getId());
        boolean esAdmin = "ADMIN".equals(usuario.getRol().getNombre());

        return esCreador || esAdmin;
    }

    @Transactional
    public void abandonarDesafio(Long desafioId, Long usuarioId) {
        Desafio desafio = buscarPorId(desafioId);

        usuarioServicio.buscarPorId(usuarioId)
                .orElseThrow(() -> new UsuarioNoEncontradoException(usuarioId));

        if (!desafioRepository.esParticipante(desafioId, usuarioId)) {
            throw new IllegalArgumentException("No eres participante de este desafío");
        }

        desafio.getParticipantes().removeIf(participante -> participante.getId().equals(usuarioId));
        desafioRepository.save(desafio);
    }
}