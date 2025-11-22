package com.aroa.sportifyme.controlador;

import com.aroa.sportifyme.modelo.Progreso;
import com.aroa.sportifyme.seguridad.dto.ProgresoDTO;
import com.aroa.sportifyme.seguridad.jwt.JwtTokenProvider;
import com.aroa.sportifyme.servicio.ProgresoServicio;
import com.aroa.sportifyme.servicio.UsuarioServicio;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/progresos")
@RequiredArgsConstructor
public class ProgresoController {

    private final ProgresoServicio progresoServicio;
    private final UsuarioServicio usuarioServicio;
    private final JwtTokenProvider jwtTokenProvider;

    @GetMapping("/usuario")
    public ResponseEntity<List<ProgresoDTO>> obtenerProgresosDelUsuario(
            @RequestHeader("Authorization") String authorizationHeader) {

        try {
            String token = authorizationHeader.replace("Bearer ", "");

            if (!jwtTokenProvider.validarToken(token)) {
                return ResponseEntity.status(403).build();
            }

            String username = jwtTokenProvider.obtenerUsernameDeToken(token);

            var usuarioOpt = usuarioServicio.buscarPorEmail(username);
            if (usuarioOpt.isEmpty()) {
                return ResponseEntity.status(404).build();
            }

            var usuario = usuarioOpt.get();

            List<Progreso> progresos = progresoServicio.obtenerProgresosPorUsuario(usuario.getId());

            List<ProgresoDTO> progresosDTO = progresos.stream()
                    .map(ProgresoDTO::fromEntity)
                    .collect(Collectors.toList());

            return ResponseEntity.ok(progresosDTO);

        } catch (Exception e) {
            return ResponseEntity.status(500).build();
        }
    }

    @PostMapping
    public ResponseEntity<ProgresoDTO> registrarProgreso(
            @RequestHeader("Authorization") String authorizationHeader,
            @RequestBody RegistrarProgresoRequest request) {

        try {
            String token = authorizationHeader.replace("Bearer ", "");

            if (!jwtTokenProvider.validarToken(token)) {
                return ResponseEntity.status(403).build();
            }

            String username = jwtTokenProvider.obtenerUsernameDeToken(token);

            var usuarioOpt = usuarioServicio.buscarPorEmail(username);
            if (usuarioOpt.isEmpty()) {
                return ResponseEntity.status(404).build();
            }

            var usuario = usuarioOpt.get();

            Progreso progreso = progresoServicio.registrarProgreso(
                    usuario.getId(),
                    request.getDesafioId(),
                    request.getValorActual(),
                    request.getUnidad(),
                    request.getComentario(),
                    request.getDispositivo());

            return ResponseEntity.ok(ProgresoDTO.fromEntity(progreso));

        } catch (Exception e) {
            return ResponseEntity.status(500).build();
        }
    }

    @GetMapping("/desafio/{desafioId}")
    public ResponseEntity<List<ProgresoDTO>> obtenerProgresosPorDesafio(
            @RequestHeader("Authorization") String authorizationHeader,
            @PathVariable Long desafioId) {

        try {
            String token = authorizationHeader.replace("Bearer ", "");

            if (!jwtTokenProvider.validarToken(token)) {
                return ResponseEntity.status(403).build();
            }

            String username = jwtTokenProvider.obtenerUsernameDeToken(token);

            var usuarioOpt = usuarioServicio.buscarPorEmail(username);
            if (usuarioOpt.isEmpty()) {
                return ResponseEntity.status(404).build();
            }

            var usuario = usuarioOpt.get();

            List<Progreso> progresos = progresoServicio.obtenerProgresosPorUsuarioYDesafio(
                    usuario.getId(), desafioId);

            List<ProgresoDTO> progresosDTO = progresos.stream()
                    .map(ProgresoDTO::fromEntity)
                    .collect(Collectors.toList());

            return ResponseEntity.ok(progresosDTO);

        } catch (Exception e) {
            return ResponseEntity.status(500).build();
        }
    }

    @GetMapping("/desafio/{desafioId}/total")
    public ResponseEntity<BigDecimal> obtenerProgresoTotalPorDesafio(
            @RequestHeader("Authorization") String authorizationHeader,
            @PathVariable Long desafioId) {

        try {
            String token = authorizationHeader.replace("Bearer ", "");

            if (!jwtTokenProvider.validarToken(token)) {
                return ResponseEntity.status(403).build();
            }

            String username = jwtTokenProvider.obtenerUsernameDeToken(token);

            var usuarioOpt = usuarioServicio.buscarPorEmail(username);
            if (usuarioOpt.isEmpty()) {
                return ResponseEntity.status(404).build();
            }

            var usuario = usuarioOpt.get();

            BigDecimal total = progresoServicio.obtenerProgresoTotalPorDesafio(
                    usuario.getId(), desafioId);

            return ResponseEntity.ok(total);

        } catch (Exception e) {
            return ResponseEntity.status(500).build();
        }
    }

    @PutMapping("/{progresoId}")
    public ResponseEntity<ProgresoDTO> actualizarProgreso(
            @RequestHeader("Authorization") String authorizationHeader,
            @PathVariable Long progresoId,
            @RequestBody ActualizarProgresoRequest request) {

        try {
            String token = authorizationHeader.replace("Bearer ", "");

            if (!jwtTokenProvider.validarToken(token)) {
                return ResponseEntity.status(403).build();
            }

            String username = jwtTokenProvider.obtenerUsernameDeToken(token);

            var usuarioOpt = usuarioServicio.buscarPorEmail(username);
            if (usuarioOpt.isEmpty()) {
                return ResponseEntity.status(404).build();
            }

            var usuario = usuarioOpt.get();

            Progreso progreso = progresoServicio.actualizarProgreso(
                    progresoId,
                    usuario.getId(),
                    request.getValorActual(),
                    request.getUnidad(),
                    request.getComentario(),
                    request.getDispositivo());

            return ResponseEntity.ok(ProgresoDTO.fromEntity(progreso));

        } catch (RuntimeException e) {
            return ResponseEntity.status(404).build();
        } catch (Exception e) {
            return ResponseEntity.status(500).build();
        }
    }

    @DeleteMapping("/{progresoId}")
    public ResponseEntity<Void> eliminarProgreso(
            @RequestHeader("Authorization") String authorizationHeader,
            @PathVariable Long progresoId) {

        try {
            String token = authorizationHeader.replace("Bearer ", "");

            if (!jwtTokenProvider.validarToken(token)) {
                return ResponseEntity.status(403).build();
            }

            String username = jwtTokenProvider.obtenerUsernameDeToken(token);

            var usuarioOpt = usuarioServicio.buscarPorEmail(username);
            if (usuarioOpt.isEmpty()) {
                return ResponseEntity.status(404).build();
            }

            var usuario = usuarioOpt.get();

            progresoServicio.eliminarProgreso(progresoId, usuario.getId());

            return ResponseEntity.ok().build();

        } catch (RuntimeException e) {
            return ResponseEntity.status(404).build();
        } catch (Exception e) {
            return ResponseEntity.status(500).build();
        }
    }
}

class RegistrarProgresoRequest {
    private Long desafioId;
    private BigDecimal valorActual;
    private String unidad;
    private String comentario;
    private String dispositivo;

    public Long getDesafioId() {
        return desafioId;
    }

    public void setDesafioId(Long desafioId) {
        this.desafioId = desafioId;
    }

    public BigDecimal getValorActual() {
        return valorActual;
    }

    public void setValorActual(BigDecimal valorActual) {
        this.valorActual = valorActual;
    }

    public String getUnidad() {
        return unidad;
    }

    public void setUnidad(String unidad) {
        this.unidad = unidad;
    }

    public String getComentario() {
        return comentario;
    }

    public void setComentario(String comentario) {
        this.comentario = comentario;
    }

    public String getDispositivo() {
        return dispositivo;
    }

    public void setDispositivo(String dispositivo) {
        this.dispositivo = dispositivo;
    }
}

class ActualizarProgresoRequest {
    private BigDecimal valorActual;
    private String unidad;
    private String comentario;
    private String dispositivo;

    public BigDecimal getValorActual() {
        return valorActual;
    }

    public void setValorActual(BigDecimal valorActual) {
        this.valorActual = valorActual;
    }

    public String getUnidad() {
        return unidad;
    }

    public void setUnidad(String unidad) {
        this.unidad = unidad;
    }

    public String getComentario() {
        return comentario;
    }

    public void setComentario(String comentario) {
        this.comentario = comentario;
    }

    public String getDispositivo() {
        return dispositivo;
    }

    public void setDispositivo(String dispositivo) {
        this.dispositivo = dispositivo;
    }
}