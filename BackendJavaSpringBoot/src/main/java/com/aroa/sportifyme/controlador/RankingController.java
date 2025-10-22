package com.aroa.sportifyme.controlador;

import com.aroa.sportifyme.seguridad.dto.RankingDTO;
import com.aroa.sportifyme.servicio.RankingService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/api/ranking")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:4200")
public class RankingController {

    private final RankingService rankingService;

    @GetMapping("/filtrado")
    public ResponseEntity<?> getRankingFiltrado(
            @RequestParam String tipo,
            @RequestParam(required = false) Integer limit,
            @RequestParam(required = false) Long desafioId) {
        
        try {
            log.info("Solicitando ranking filtrado - tipo: {}, limit: {}, desafioId: {}", tipo, limit, desafioId);
            
            List<RankingDTO> ranking;
            
            switch (tipo.toLowerCase()) {
                case "global":
                    ranking = rankingService.obtenerRankingGlobalConLimite(limit);
                    break;
                case "desafio":
                    if (desafioId == null) {
                        return ResponseEntity.badRequest()
                                .body(Map.of("error", "Para tipo 'desafio' se requiere el parámetro 'desafioId'"));
                    }
                    ranking = rankingService.obtenerRankingPorDesafio(desafioId);
                    if (limit != null && limit > 0 && ranking.size() > limit) {
                        ranking = ranking.subList(0, limit);
                    }
                    break;
                default:
                    return ResponseEntity.badRequest()
                            .body(Map.of("error", "Tipo de ranking no válido: " + tipo));
            }
            
            log.info("Ranking obtenido exitosamente: {} registros", ranking.size());
            return ResponseEntity.ok(ranking);
            
        } catch (Exception e) {
            log.error("Error al obtener ranking filtrado - tipo: {}, limit: {}, desafioId: {}", tipo, limit, desafioId, e);
            return ResponseEntity.internalServerError()
                    .body(Map.of("error", "Error interno del servidor: " + e.getMessage()));
        }
    }

    @GetMapping("/global")
    public ResponseEntity<?> getRankingGlobal(@RequestParam(required = false) Integer limit) {
        try {
            log.info("Solicitando ranking global - limit: {}", limit);
            List<RankingDTO> ranking = rankingService.obtenerRankingGlobalConLimite(limit);
            
            for (int i = 0; i < ranking.size(); i++) {
                ranking.get(i).setPosicion(i + 1);
            }
            
            log.info("Ranking global obtenido exitosamente: {} registros", ranking.size());
            return ResponseEntity.ok(ranking);
        } catch (Exception e) {
            log.error("Error al obtener ranking global - limit: {}", limit, e);
            return ResponseEntity.internalServerError()
                    .body(Map.of("error", "Error al obtener el ranking global: " + e.getMessage()));
        }
    }

    @GetMapping("/desafio/{desafioId}")
    public ResponseEntity<?> getRankingPorDesafio(
            @PathVariable Long desafioId,
            @RequestParam(required = false) Integer limit) {
        
        try {
            log.info("Solicitando ranking por desafío - desafioId: {}, limit: {}", desafioId, limit);
            
            List<RankingDTO> ranking = rankingService.obtenerRankingPorDesafio(desafioId);
            
            if (limit != null && limit > 0 && ranking.size() > limit) {
                ranking = ranking.subList(0, limit);
            }
            
            log.info("Ranking por desafío obtenido exitosamente: {} registros", ranking.size());
            return ResponseEntity.ok(ranking);
            
        } catch (Exception e) {
            log.error("Error al obtener ranking por desafío - desafioId: {}, limit: {}", desafioId, limit, e);
            return ResponseEntity.internalServerError()
                    .body(Map.of("error", "Error al obtener el ranking del desafío: " + e.getMessage()));
        }
    }

    @GetMapping("/desafio/{desafioId}/participantes")
    public ResponseEntity<?> getTotalParticipantesDesafio(@PathVariable Long desafioId) {
        try {
            Long totalParticipantes = rankingService.obtenerTotalParticipantesDesafio(desafioId);
            return ResponseEntity.ok(Map.of("totalParticipantes", totalParticipantes));
        } catch (Exception e) {
            log.error("Error al obtener total de participantes del desafío {}: ", desafioId, e);
            return ResponseEntity.internalServerError()
                    .body(Map.of("error", "Error al obtener total de participantes: " + e.getMessage()));
        }
    }

    @GetMapping("/desafio/{desafioId}/usuario/{usuarioId}/participante")
    public ResponseEntity<?> esUsuarioParticipante(
            @PathVariable Long desafioId,
            @PathVariable Long usuarioId) {
        try {
            boolean esParticipante = rankingService.esUsuarioParticipante(desafioId, usuarioId);
            return ResponseEntity.ok(Map.of("esParticipante", esParticipante));
        } catch (Exception e) {
            log.error("Error al verificar participación del usuario {} en desafío {}: ", usuarioId, desafioId, e);
            return ResponseEntity.internalServerError()
                    .body(Map.of("error", "Error al verificar participación: " + e.getMessage()));
        }
    }
}