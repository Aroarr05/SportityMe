package com.aroa.sportifyme.controlador;

import com.aroa.sportifyme.modelo.Progreso;
import com.aroa.sportifyme.seguridad.dto.ProgresoDTO;
import com.aroa.sportifyme.servicio.ProgresoService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/progreso")
@RequiredArgsConstructor
public class ProgresoControlador {

    private final ProgresoService progresoService;

    @PostMapping
    public ResponseEntity<?> registrarProgreso(
            @RequestBody ProgresoDTO progresoDTO,
            @AuthenticationPrincipal Long usuarioId) {
        try {
            Progreso progreso = progresoService.registrarProgreso(progresoDTO, usuarioId);
            return ResponseEntity.ok(progreso);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/desafio/{desafioId}")
    public ResponseEntity<List<Progreso>> obtenerProgreso(
            @PathVariable Long desafioId,
            @AuthenticationPrincipal Long usuarioId) {
        List<Progreso> progresos = progresoService.obtenerProgresoPorUsuarioYDesafio(usuarioId, desafioId);
        return ResponseEntity.ok(progresos);
    }

    @GetMapping("/desafio/{desafioId}/ranking")
    public ResponseEntity<List<Progreso>> obtenerRankingDesafio(@PathVariable Long desafioId) {
        List<Progreso> ranking = progresoService.obtenerRankingPorDesafio(desafioId);
        return ResponseEntity.ok(ranking);
    }

    @GetMapping("/desafio/{desafioId}/actual")
    public ResponseEntity<Double> obtenerProgresoActual(
            @PathVariable Long desafioId,
            @AuthenticationPrincipal Long usuarioId) {
        Double progresoActual = progresoService.obtenerProgresoActual(usuarioId, desafioId).doubleValue();
        return ResponseEntity.ok(progresoActual);
    }
}