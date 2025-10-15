package com.aroa.sportifyme.servicio;

import com.aroa.sportifyme.exception.*;
import com.aroa.sportifyme.modelo.*;
import com.aroa.sportifyme.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
@RequiredArgsConstructor
public class LogroServicio {

    private final LogroRepository logroRepository;
    private final UsuarioLogroRepository usuarioLogroRepository;
    private final UsuarioServicio usuarioServicio;
    private final NotificacionServicio notificacionServicio;

    @Transactional
    public Logro crearLogro(Logro logro) {
        if (logroRepository.existsByCriterio(logro.getCriterio())) {
            throw new RecursoExistenteException("Ya existe un logro con este criterio");
        }
        return logroRepository.save(logro);
    }

    @Transactional(readOnly = true)
    public List<Logro> listarTodosLogros() {
        return logroRepository.findAll();
    }

    @Transactional(readOnly = true)
    public Logro buscarLogroPorId(Long id) {
        return logroRepository.findById(id)
                .orElseThrow(() -> new RecursoNoEncontradoException("Logro no encontrado"));
    }

    @Transactional
    public void desbloquearLogro(Long usuarioId, String criterio) {
        if (!usuarioLogroRepository.existsByUsuarioIdAndLogroCriterio(usuarioId, criterio)) {
            Logro logro = logroRepository.findByCriterio(criterio)
                    .orElseThrow(() -> new RecursoNoEncontradoException("Logro no encontrado"));

            Usuario usuario = usuarioServicio.buscarPorId(usuarioId)
                    .orElseThrow(() -> new RecursoNoEncontradoException("Usuario no encontrado"));

            UsuarioLogro usuarioLogro = UsuarioLogro.builder()
                    .usuario(usuario)
                    .logro(logro)
                    .build();

            usuarioLogroRepository.save(usuarioLogro);

            notificacionServicio.crearNotificacion(
                    usuarioId,
                    "LOGRO",
                    "¡Felicidades! Has obtenido el logro: " + logro.getNombre(),
                    "/logros/" + logro.getId()
            );
        }
    }

    @Transactional(readOnly = true)
    public List<UsuarioLogro> obtenerLogrosDeUsuario(Long usuarioId) {
        return usuarioLogroRepository.findByUsuarioId(usuarioId);
    }

    @Transactional(readOnly = true)
    public boolean usuarioTieneLogro(Long usuarioId, String criterio) {
        return usuarioLogroRepository.existsByUsuarioIdAndLogroCriterio(usuarioId, criterio);
    }
}