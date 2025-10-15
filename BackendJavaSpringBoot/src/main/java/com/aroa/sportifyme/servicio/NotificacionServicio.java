package com.aroa.sportifyme.servicio;

import com.aroa.sportifyme.exception.*;
import com.aroa.sportifyme.modelo.*;
import com.aroa.sportifyme.repository.*;
import com.aroa.sportifyme.seguridad.dto.NotificacionDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class NotificacionServicio {

    private final NotificacionRepository notificacionRepository;
    private final UsuarioServicio usuarioServicio;
    private final SimpMessagingTemplate messagingTemplate;

    @Transactional
    public Notificacion crearNotificacion(Long usuarioId, String tipo, String mensaje, String enlace) {
        Usuario usuario = usuarioServicio.buscarPorId(usuarioId)
                .orElseThrow(() -> new UsuarioNoEncontradoException(usuarioId));

        Notificacion notificacion = Notificacion.builder()
                .usuario(usuario)
                .tipo(Notificacion.TipoNotificacion.valueOf(tipo))
                .mensaje(mensaje)
                .enlace(enlace)
                .leida(false)
                .fechaCreacion(LocalDateTime.now())
                .build();

        Notificacion guardada = notificacionRepository.save(notificacion);
        enviarNotificacionEnTiempoReal(guardada);
        return guardada;
    }

    @Transactional(readOnly = true)
    public List<Notificacion> obtenerNotificacionesUsuario(Long usuarioId, boolean noLeidas) {
        if (!usuarioServicio.existePorId(usuarioId)) {
            throw new UsuarioNoEncontradoException(usuarioId);
        }

        return noLeidas
                ? notificacionRepository.findByUsuarioIdAndLeidaFalseOrderByFechaCreacionDesc(usuarioId)
                : notificacionRepository.findByUsuarioIdOrderByFechaCreacionDesc(usuarioId);
    }

    @Transactional(readOnly = true)
    public Notificacion obtenerNotificacionPorIdYUsuario(Long id, Long usuarioId) {
        return notificacionRepository.findByIdAndUsuarioId(id, usuarioId)
                .orElseThrow(() -> new NotificacionNoEncontradaException(id, usuarioId));
    }

    @Transactional
    public Notificacion marcarComoLeida(Long notificacionId, Long usuarioId) {
        Notificacion notificacion = obtenerNotificacionPorIdYUsuario(notificacionId, usuarioId);
        if (!notificacion.isLeida()) { 
            notificacion.setLeida(true);
            return notificacionRepository.save(notificacion);
        }
        return notificacion;
    }

    @Transactional
    public int marcarTodasComoLeidas(Long usuarioId) {
        List<Notificacion> notificaciones = notificacionRepository.findByUsuarioIdAndLeidaFalse(usuarioId);
        notificaciones.forEach(notificacion -> notificacion.setLeida(true));
        notificacionRepository.saveAll(notificaciones);
        return notificaciones.size();
    }

    @Transactional
    public void eliminarNotificacion(Long notificacionId, Long usuarioId) {
        Notificacion notificacion = obtenerNotificacionPorIdYUsuario(notificacionId, usuarioId);
        notificacionRepository.delete(notificacion);
    }

    @Transactional(readOnly = true)
    public long contarNotificacionesNoLeidasUsuario(Long usuarioId) {
        if (!usuarioServicio.existePorId(usuarioId)) {
            throw new UsuarioNoEncontradoException(usuarioId);
        }
        return notificacionRepository.countByUsuarioIdAndLeidaFalse(usuarioId);
    }

    @Transactional(readOnly = true)
    public long contarNotificacionesUsuario(Long usuarioId) {
        if (!usuarioServicio.existePorId(usuarioId)) {
            throw new UsuarioNoEncontradoException(usuarioId);
        }
        return notificacionRepository.countByUsuarioId(usuarioId);
    }

    private void enviarNotificacionEnTiempoReal(Notificacion notificacion) {
        try {
            messagingTemplate.convertAndSendToUser(
                    notificacion.getUsuario().getId().toString(),
                    "/queue/notificaciones",
                    new NotificacionDTO(notificacion)
            );
        } catch (Exception e) {
            System.err.println("Error enviando notificación WebSocket: " + e.getMessage());
        }
    }
}