package com.aroa.sportifyme.controlador;

import com.aroa.sportifyme.modelo.Desafio;
import com.aroa.sportifyme.modelo.Usuario;
import com.aroa.sportifyme.seguridad.dto.DesafioDTO;
import com.aroa.sportifyme.servicio.DesafioServicio;
import com.aroa.sportifyme.servicio.UsuarioServicio;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Slf4j
@RestController
@RequestMapping("/api/desafios")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:4200")
public class DesafioController {

    private final DesafioServicio desafioServicio;
    private final UsuarioServicio usuarioServicio;

    @GetMapping
    public ResponseEntity<?> listarTodosLosDesafios() {
        try {
            log.info("Solicitando lista de desafíos");
            List<Desafio> desafios = desafioServicio.listarTodos();
            log.info("Encontrados {} desafíos", desafios.size());

            List<DesafioDTO> desafiosDTO = desafios.stream()
                    .map(DesafioDTO::fromEntity)
                    .collect(Collectors.toList());

            return ResponseEntity.ok(desafiosDTO);
        } catch (Exception e) {
            log.error("Error al listar desafíos: ", e);
            return ResponseEntity.internalServerError()
                    .body(Map.of("error", "Error interno del servidor: " + e.getMessage()));
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> obtenerDesafioPorId(@PathVariable Long id) {
        try {
            Desafio desafio = desafioServicio.buscarPorId(id);
            DesafioDTO desafioDTO = DesafioDTO.fromEntity(desafio);
            return ResponseEntity.ok(desafioDTO);
        } catch (Exception e) {
            log.error("Error al obtener desafío con id {}: ", id, e);
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/{desafioId}/participantes")
    public ResponseEntity<?> obtenerParticipantes(@PathVariable Long desafioId) {
        try {
            List<Usuario> participantes = desafioServicio.obtenerParticipantesDesafio(desafioId);
            return ResponseEntity.ok(participantes);
        } catch (Exception e) {
            log.error("Error al obtener participantes del desafío {}: ", desafioId, e);
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/{desafioId}/unirse")
    public ResponseEntity<?> unirseADesafio(
            @PathVariable Long desafioId,
            @AuthenticationPrincipal UserDetails userDetails) {
        try {
            Long usuarioId = obtenerUsuarioIdDesdeUserDetails(userDetails);
            desafioServicio.unirseADesafio(desafioId, usuarioId);
            return ResponseEntity.ok().body(Map.of("message", "Te has unido al desafío exitosamente"));
        } catch (Exception e) {
            log.error("Error al unirse al desafío {}: ", desafioId, e);
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    private Long obtenerUsuarioIdDesdeUserDetails(UserDetails userDetails) {
        String username = userDetails.getUsername();
        return usuarioServicio.buscarPorEmail(username)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado: " + username))
                .getId();
    }

    @GetMapping("/{desafioId}/participacion")
    public ResponseEntity<?> verificarParticipacion(
            @PathVariable Long desafioId,
            @AuthenticationPrincipal UserDetails userDetails) {
        try {
            Long usuarioId = obtenerUsuarioIdDesdeUserDetails(userDetails);
            boolean participa = desafioServicio.esParticipante(desafioId, usuarioId);
            return ResponseEntity.ok(Map.of("participando", participa));
        } catch (Exception e) {
            log.error("Error al verificar participación en desafío {}: ", desafioId, e);
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @DeleteMapping("/{desafioId}/participar")
    public ResponseEntity<?> abandonarDesafio(
            @PathVariable Long desafioId,
            @AuthenticationPrincipal UserDetails userDetails) {
        try {
            Long usuarioId = obtenerUsuarioIdDesdeUserDetails(userDetails);
            desafioServicio.abandonarDesafio(desafioId, usuarioId);
            return ResponseEntity.ok().body(Map.of("message", "Has abandonado el desafío exitosamente"));
        } catch (Exception e) {
            log.error("Error al abandonar el desafío {}: ", desafioId, e);
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}