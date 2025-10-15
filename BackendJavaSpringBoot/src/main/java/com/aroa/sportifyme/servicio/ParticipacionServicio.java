package com.aroa.sportifyme.servicio;

import com.aroa.sportifyme.exception.*;
import com.aroa.sportifyme.modelo.*;
import com.aroa.sportifyme.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ParticipacionServicio {

    private final ParticipacionRepository participacionRepository;
    private final UsuarioServicio usuarioServicio;
    private final DesafioServicio desafioServicio;

    @Transactional
    public Participacion unirseADesafio(Long desafioId, String emailUsuario) {
        Usuario usuario = usuarioServicio.buscarPorEmail(emailUsuario)
                .orElseThrow(() -> new UsuarioNoEncontradoException(emailUsuario));

        Desafio desafio = desafioServicio.buscarPorId(desafioId);
        validarParticipacion(usuario, desafio);

        Participacion participacion = Participacion.builder()
                .usuario(usuario)
                .desafio(desafio)
                .build();

        return participacionRepository.save(participacion);
    }

    @Transactional
    public void abandonarDesafio(Long participacionId, String emailUsuario) {
        Participacion participacion = findById(participacionId);
        Usuario usuario = usuarioServicio.buscarPorEmail(emailUsuario)
                .orElseThrow(() -> new UsuarioNoEncontradoException(emailUsuario));

        validarPermisosAbandono(participacion, usuario);
        validarFechaDesafio(participacion.getDesafio());

        participacionRepository.delete(participacion);
    }

    @Transactional(readOnly = true)
    public Participacion findById(Long id) {
        return participacionRepository.findById(id)
                .orElseThrow(() -> {
                    Participacion participacion = participacionRepository.findById(id).orElse(null);
                    if (participacion != null) {
                        return new ParticipacionNoEncontradaException(
                                participacion.getUsuario().getId(),
                                participacion.getDesafio().getId()
                        );
                    } else {
                        return new ParticipacionNoEncontradaException(null, null);
                    }
                });
    }

    @Transactional(readOnly = true)
    public List<Participacion> obtenerParticipacionesPorUsuario(Long usuarioId) {
        return participacionRepository.findByUsuarioId(usuarioId);
    }

    @Transactional(readOnly = true)
    public List<Participacion> obtenerParticipantesPorDesafio(Long desafioId) {
        return participacionRepository.findByDesafioId(desafioId);
    }

    @Transactional(readOnly = true)
    public boolean usuarioParticipaEnDesafio(Long usuarioId, Long desafioId) {
        return participacionRepository.existsByUsuarioIdAndDesafioId(usuarioId, desafioId);
    }

    @Transactional(readOnly = true)
    public long contarParticipantesPorDesafio(Long desafioId) {
        return participacionRepository.countByDesafioId(desafioId);
    }

    private void validarParticipacion(Usuario usuario, Desafio desafio) {
        if (usuarioParticipaEnDesafio(usuario.getId(), desafio.getId())) {
            throw new ParticipacionExistenteException(usuario.getId(), desafio.getId());
        }

        if (LocalDateTime.now().isAfter(desafio.getFechaFin())) {
            throw new DesafioExpiradoException(desafio.getId());
        }

        if (desafio.getMaxParticipantes() != null &&
                contarParticipantesPorDesafio(desafio.getId()) >= desafio.getMaxParticipantes()) {
            throw new LimiteParticipantesException(desafio.getId(), desafio.getMaxParticipantes());
        }
    }

    private void validarPermisosAbandono(Participacion participacion, Usuario usuario) {
        boolean esPropietario = participacion.getUsuario().equals(usuario);
        boolean esAdmin = usuario.getRol() != null && 
                         usuario.getRol().getNombre() != null && 
                         usuario.getRol().getNombre().equals("ADMIN");
        
        if (!esPropietario && !esAdmin) {
            throw new AccesoNoAutorizadoException(
                    "abandonar",
                    "participación",
                    participacion.getId()
            );
        }
    }

    private void validarFechaDesafio(Desafio desafio) {
        if (LocalDateTime.now().isAfter(desafio.getFechaFin())) {
            throw new DesafioExpiradoException(desafio.getId());
        }
    }
    
   
}