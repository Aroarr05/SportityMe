package com.aroa.sportifyme.controlador;

import com.aroa.sportifyme.modelo.Notificacion;
import com.aroa.sportifyme.seguridad.dto.NotificacionDTO;
import com.aroa.sportifyme.servicio.NotificacionServicio;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/notificaciones")
@RequiredArgsConstructor
public class NotificacionController {

    private final NotificacionServicio notificacionServicio;

    @GetMapping
    public ResponseEntity<List<NotificacionDTO>> obtenerNotificacionesUsuario(
            @AuthenticationPrincipal Long usuarioId,
            @RequestParam(required = false) Boolean noLeidas) {

        boolean filtrarNoLeidas = noLeidas != null && noLeidas;
        List<Notificacion> notificaciones = notificacionServicio
                .obtenerNotificacionesUsuario(usuarioId, filtrarNoLeidas);

        List<NotificacionDTO> dtos = notificaciones.stream()
                .map(NotificacionDTO::new)
                .collect(Collectors.toList());

        return ResponseEntity.ok(dtos);
    }

    @GetMapping("/{id}")
    public ResponseEntity<NotificacionDTO> obtenerNotificacion(
            @PathVariable Long id,
            @AuthenticationPrincipal Long usuarioId) {

        Notificacion notificacion = notificacionServicio
                .obtenerNotificacionPorIdYUsuario(id, usuarioId);

        return ResponseEntity.ok(new NotificacionDTO(notificacion));
    }

    @GetMapping("/estadisticas")
    public ResponseEntity<Map<String, Long>> obtenerEstadisticas(
            @AuthenticationPrincipal Long usuarioId) {

        long total = notificacionServicio.contarNotificacionesUsuario(usuarioId);
        long noLeidas = notificacionServicio.contarNotificacionesNoLeidasUsuario(usuarioId);

        return ResponseEntity.ok(Map.of(
                "total", total,
                "noLeidas", noLeidas
        ));
    }

    @PatchMapping("/{id}/leer")
    public ResponseEntity<Void> marcarComoLeida(
            @PathVariable Long id,
            @AuthenticationPrincipal Long usuarioId) {

        notificacionServicio.marcarComoLeida(id, usuarioId);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/marcar-todas")
    public ResponseEntity<Void> marcarTodasComoLeidas(
            @AuthenticationPrincipal Long usuarioId) {

        notificacionServicio.marcarTodasComoLeidas(usuarioId);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminarNotificacion(
            @PathVariable Long id,
            @AuthenticationPrincipal Long usuarioId) {

        notificacionServicio.eliminarNotificacion(id, usuarioId);
        return ResponseEntity.noContent().build();
    }
}