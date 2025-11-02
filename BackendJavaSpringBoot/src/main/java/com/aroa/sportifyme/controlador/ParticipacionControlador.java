package com.aroa.sportifyme.controlador;

import com.aroa.sportifyme.servicio.ParticipacionServicio;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/participaciones")
@RequiredArgsConstructor
public class ParticipacionControlador {

    private final ParticipacionServicio participacionServicio;

    @GetMapping("/desafio/{desafioId}")
    public ResponseEntity<Boolean> verificarParticipacion(
            @PathVariable Long desafioId,
            @AuthenticationPrincipal UserDetails userDetails) {

        if (userDetails == null) {
            return ResponseEntity.ok(false);
        }

        boolean participa = participacionServicio.verificarParticipacion(userDetails.getUsername(), desafioId);
        return ResponseEntity.ok(participa);
    }

    @PostMapping("/desafio/{desafioId}/unirse")
    public ResponseEntity<?> unirseADesafio(
            @PathVariable Long desafioId,
            @AuthenticationPrincipal UserDetails userDetails) {

        if (userDetails == null) {
            return ResponseEntity.status(401).body(Map.of("error", "No autenticado"));
        }

        try {
            participacionServicio.unirseADesafio(userDetails.getUsername(), desafioId);
            return ResponseEntity.ok(Map.of("message", "Unido al desafío exitosamente"));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/desafio/{desafioId}/abandonar")
    public ResponseEntity<?> abandonarDesafio(
            @PathVariable Long desafioId,
            @AuthenticationPrincipal UserDetails userDetails) {

        if (userDetails == null) {
            return ResponseEntity.status(401).body(Map.of("error", "No autenticado"));
        }

        try {
            participacionServicio.abandonarDesafio(userDetails.getUsername(), desafioId);
            return ResponseEntity.ok(Map.of("message", "Desafío abandonado"));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}