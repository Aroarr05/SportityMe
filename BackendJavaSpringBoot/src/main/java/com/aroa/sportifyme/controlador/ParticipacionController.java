package com.aroa.sportifyme.controlador;

import com.aroa.sportifyme.exception.*;
import com.aroa.sportifyme.modelo.Participacion;
import com.aroa.sportifyme.seguridad.dto.response.ApiResponse;
import com.aroa.sportifyme.servicio.ParticipacionServicio;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/participaciones")
@RequiredArgsConstructor
public class ParticipacionController {

    private final ParticipacionServicio participacionServicio;

    @PostMapping("/desafio/{desafioId}")
    public ResponseEntity<ApiResponse<Participacion>> unirseADesafio(
            @PathVariable Long desafioId,
            Authentication authentication) {
        try {
            Participacion participacion = participacionServicio.unirseADesafio(
                    desafioId,
                    authentication.getName()
            );
            return ResponseEntity
                    .status(HttpStatus.CREATED)
                    .body(ApiResponse.success(
                            "Te has unido al desafío correctamente",
                            participacion
                    ));
        } catch (ParticipacionExistenteException e) {
            return ResponseEntity
                    .status(HttpStatus.CONFLICT)
                    .body(ApiResponse.error(e.getMessage()));
        } catch (AccesoNoAutorizadoException e) {
            return ResponseEntity
                    .status(HttpStatus.FORBIDDEN)
                    .body(ApiResponse.error(e.getMessage()));
        } catch (DesafioExpiradoException | LimiteParticipantesException e) {
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(ApiResponse.error(e.getMessage()));
        } catch (UsuarioNoEncontradoException | DesafioNoEncontradoException e) {
            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.error(e.getMessage()));
        }
    }

    @DeleteMapping("/{participacionId}")
    public ResponseEntity<ApiResponse<Void>> abandonarDesafio(
            @PathVariable Long participacionId,
            Authentication authentication) {
        try {
            participacionServicio.abandonarDesafio(
                    participacionId,
                    authentication.getName()
            );
            return ResponseEntity
                    .status(HttpStatus.NO_CONTENT)
                    .body(ApiResponse.success(
                            "Has abandonado el desafío correctamente",
                            null
                    ));
        } catch (AccesoNoAutorizadoException e) {
            return ResponseEntity
                    .status(HttpStatus.FORBIDDEN)
                    .body(ApiResponse.error(e.getMessage()));
        } catch (DesafioExpiradoException e) {
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(ApiResponse.error(e.getMessage()));
        } catch (ParticipacionNoEncontradaException e) {
            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.error(e.getMessage()));
        }
    }

    @GetMapping("/usuario/{usuarioId}")
    public ResponseEntity<ApiResponse<List<Participacion>>> obtenerParticipacionesPorUsuario(
            @PathVariable Long usuarioId) {
        List<Participacion> participaciones = participacionServicio.obtenerParticipacionesPorUsuario(usuarioId);
        return ResponseEntity.ok(
                ApiResponse.success(
                        "Participaciones obtenidas exitosamente",
                        participaciones
                )
        );
    }

    @GetMapping("/desafio/{desafioId}")
    public ResponseEntity<ApiResponse<List<Participacion>>> obtenerParticipantesPorDesafio(
            @PathVariable Long desafioId) {
        List<Participacion> participantes = participacionServicio.obtenerParticipantesPorDesafio(desafioId);
        return ResponseEntity.ok(
                ApiResponse.success(
                        "Participantes obtenidos exitosamente",
                        participantes
                )
        );
    }
}