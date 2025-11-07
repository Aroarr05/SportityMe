package com.aroa.sportifyme.controlador;

import com.aroa.sportifyme.modelo.Desafio;
import com.aroa.sportifyme.modelo.Usuario;
import com.aroa.sportifyme.seguridad.dto.DesafioDTO;
import com.aroa.sportifyme.seguridad.dto.request.CrearDesafioRequest;
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

    @PostMapping
    public ResponseEntity<?> crearDesafio(
            @RequestBody CrearDesafioRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
        try {
            log.info("Creando nuevo desafío: {}", request.getTitulo());

 
            Long usuarioId = obtenerUsuarioIdDesdeUserDetails(userDetails);

       
            Desafio.TipoActividad tipoActividad = Desafio.TipoActividad.valueOf(
                    request.getTipo_actividad().toLowerCase() 
            );
            Desafio.Dificultad dificultad = Desafio.Dificultad.valueOf(
                    request.getDificultad().toUpperCase() 
            );

          
            if (request.getFecha_inicio() == null || request.getFecha_fin() == null) {
                return ResponseEntity.badRequest().body(Map.of("error", "Las fechas de inicio y fin son requeridas"));
            }

            if (request.getFecha_fin().isBefore(request.getFecha_inicio())) {
                return ResponseEntity.badRequest()
                        .body(Map.of("error", "La fecha de fin debe ser posterior a la de inicio"));
            }

          
            Desafio desafio = desafioServicio.crearDesafio(
                    request.getTitulo(),
                    request.getDescripcion(),
                    tipoActividad,
                    request.getObjetivo(),
                    request.getUnidad_objetivo(),
                    request.getFecha_inicio(),
                    request.getFecha_fin(),
                    request.getEs_publico() != null ? request.getEs_publico() : true,
                    request.getIcono() != null ? request.getIcono() : "🏃‍♂️",
                    dificultad,
                    request.getMax_participantes() != null ? request.getMax_participantes() : 10,
                    usuarioId);

            DesafioDTO respuestaDTO = DesafioDTO.fromEntity(desafio);
            log.info("Desafío creado exitosamente con ID: {}", desafio.getId());

            return ResponseEntity.status(201).body(respuestaDTO);

        } catch (IllegalArgumentException e) {
            log.error("Error de conversión de enum: ", e);
            return ResponseEntity.badRequest().body(Map.of("error",
                    "Tipo de actividad o dificultad inválida. " +
                            "Tipos válidos: correr, ciclismo, natacion, gimnasio, otros. " +
                            "Dificultades válidas: PRINCIPIANTE, INTERMEDIO, AVANZADO"));
        } catch (Exception e) {
            log.error("Error al crear desafío: ", e);
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}