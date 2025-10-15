package com.aroa.sportifyme.controlador;

import com.aroa.sportifyme.seguridad.dto.RankingDTO;
import com.aroa.sportifyme.exception.BusinessException;
import com.aroa.sportifyme.modelo.Progreso;
import com.aroa.sportifyme.seguridad.dto.ProgresoDTO;
import com.aroa.sportifyme.servicio.ProgresoServicio;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/progresos")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:4200")
public class ProgresoController {

    private final ProgresoServicio progresoServicio;

    @PostMapping
    public ResponseEntity<?> registrarProgreso(
            @Valid @RequestBody ProgresoDTO progresoDTO,
            Authentication authentication) {
        try {
            Progreso progreso = progresoServicio.registrarProgreso(progresoDTO, authentication.getName());
            URI location = ServletUriComponentsBuilder
                    .fromCurrentRequest()
                    .path("/{id}")
                    .buildAndExpand(progreso.getId())
                    .toUri();
            return ResponseEntity.created(location).body(progreso);
        } catch (BusinessException e) {
            return ResponseEntity.badRequest().body(Map.of(
                    "error", e.getMessage(),
                    "status", 400,
                    "timestamp", System.currentTimeMillis()
            ));
        }
    }

    @GetMapping("/desafio/{desafioId}")
    public ResponseEntity<List<Progreso>> obtenerProgresosPorDesafio(@PathVariable Long desafioId) {
        List<Progreso> progresos = progresoServicio.obtenerProgresosPorDesafio(desafioId);
        return ResponseEntity.ok(progresos);
    }

    @GetMapping("/ranking/{desafioId}")
    public ResponseEntity<List<RankingDTO>> obtenerRankingDesafio(@PathVariable Long desafioId) {
        List<RankingDTO> ranking = progresoServicio.generarRankingDesafio(desafioId);
        return ResponseEntity.ok(ranking);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Progreso> buscarProgresoPorId(@PathVariable Long id) {
        return progresoServicio.buscarProgresoPorId(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}