package com.aroa.sportifyme.controlador;

import com.aroa.sportifyme.seguridad.dto.RankingDTO;
import com.aroa.sportifyme.servicio.RankingService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/ranking")
@RequiredArgsConstructor
public class RankingControlador {

    private final RankingService rankingService;

    @GetMapping("/global")
    public ResponseEntity<List<RankingDTO>> obtenerRankingGlobal() {
        try {
            List<RankingDTO> ranking = rankingService.obtenerRankingGlobal();
            return ResponseEntity.ok(ranking);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/desafio/{desafioId}")
    public ResponseEntity<List<RankingDTO>> obtenerRankingPorDesafio(@PathVariable Long desafioId) {
        try {
            List<RankingDTO> ranking = rankingService.obtenerRankingPorDesafio(desafioId);
            return ResponseEntity.ok(ranking);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/desafio/{desafioId}/estadisticas")
    public ResponseEntity<?> obtenerEstadisticasDesafio(@PathVariable Long desafioId) {
        try {
            Long totalParticipantes = rankingService.obtenerTotalParticipantesDesafio(desafioId);
            return ResponseEntity.ok().body("{\"totalParticipantes\": " + totalParticipantes + "}");
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }
}