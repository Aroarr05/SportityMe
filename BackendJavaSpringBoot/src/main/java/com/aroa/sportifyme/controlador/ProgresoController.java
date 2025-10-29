package com.aroa.sportifyme.controlador;

import com.aroa.sportifyme.modelo.Progreso;
import com.aroa.sportifyme.seguridad.dto.ProgresoDTO;
import com.aroa.sportifyme.servicio.ProgresoServicio;
import com.aroa.sportifyme.servicio.UsuarioServicio;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Slf4j
@RestController
@RequestMapping("/api/progresos")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:4200")
public class ProgresoController {

    private final ProgresoServicio progresoServicio;
    private final UsuarioServicio usuarioServicio;

    @PostMapping
    public ResponseEntity<?> registrarProgreso(
            @RequestBody ProgresoDTO progresoDTO,
            @AuthenticationPrincipal UserDetails userDetails) {
        try {
            Long usuarioId = obtenerUsuarioIdDesdeUserDetails(userDetails);

            Progreso progreso = progresoServicio.registrarProgreso(
                    usuarioId,
                    progresoDTO.getDesafioId(),
                    progresoDTO.getValorActual(),
                    progresoDTO.getUnidad(),
                    progresoDTO.getComentario(),
                    progresoDTO.getDispositivo());

            return ResponseEntity.ok(ProgresoDTO.fromEntity(progreso));
        } catch (Exception e) {
            log.error("Error al registrar progreso: ", e);
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/usuario")
    public ResponseEntity<?> obtenerProgresosDelUsuario(@AuthenticationPrincipal UserDetails userDetails) {
        try {
            Long usuarioId = obtenerUsuarioIdDesdeUserDetails(userDetails);
            List<Progreso> progresos = progresoServicio.obtenerProgresosPorUsuario(usuarioId);

            List<ProgresoDTO> progresosDTO = progresos.stream()
                    .map(ProgresoDTO::fromEntity)
                    .collect(Collectors.toList());

            return ResponseEntity.ok(progresosDTO);
        } catch (Exception e) {
            log.error("Error al obtener progresos del usuario: ", e);
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/desafio/{desafioId}")
    public ResponseEntity<?> obtenerProgresosPorDesafio(
            @PathVariable Long desafioId,
            @AuthenticationPrincipal UserDetails userDetails) {
        try {
            Long usuarioId = obtenerUsuarioIdDesdeUserDetails(userDetails);
            List<Progreso> progresos = progresoServicio.obtenerProgresosPorUsuarioYDesafio(usuarioId, desafioId);

            List<ProgresoDTO> progresosDTO = progresos.stream()
                    .map(ProgresoDTO::fromEntity)
                    .collect(Collectors.toList());

            return ResponseEntity.ok(progresosDTO);
        } catch (Exception e) {
            log.error("Error al obtener progresos del desafío: ", e);
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/desafio/{desafioId}/total")
    public ResponseEntity<?> obtenerProgresoTotalPorDesafio(
            @PathVariable Long desafioId,
            @AuthenticationPrincipal UserDetails userDetails) {
        try {
            Long usuarioId = obtenerUsuarioIdDesdeUserDetails(userDetails);
            BigDecimal total = progresoServicio.obtenerProgresoTotalPorDesafio(usuarioId, desafioId);

            return ResponseEntity.ok(Map.of("total", total));
        } catch (Exception e) {
            log.error("Error al obtener progreso total: ", e);
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    private Long obtenerUsuarioIdDesdeUserDetails(UserDetails userDetails) {
        String username = userDetails.getUsername();
        return usuarioServicio.buscarPorEmail(username)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado: " + username))
                .getId();
    }

    @GetMapping("/mi-historial")
    public ResponseEntity<?> obtenerMiHistorial(@AuthenticationPrincipal UserDetails userDetails) {
        try {
            Long usuarioId = obtenerUsuarioIdDesdeUserDetails(userDetails);
            List<Progreso> progresos = progresoServicio.obtenerProgresosPorUsuario(usuarioId);

            List<ProgresoDTO> progresosDTO = progresos.stream()
                    .map(ProgresoDTO::fromEntity)
                    .collect(Collectors.toList());

            return ResponseEntity.ok(progresosDTO);
        } catch (Exception e) {
            log.error("Error al obtener historial del usuario: ", e);
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}