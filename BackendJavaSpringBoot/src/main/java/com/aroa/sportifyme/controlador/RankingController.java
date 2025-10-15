package com.aroa.sportifyme.controlador;

import com.aroa.sportifyme.seguridad.dto.RankingDTO;
import com.aroa.sportifyme.servicio.RankingServicio;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/rankings")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:4200")
public class RankingController {

    private final RankingServicio rankingServicio;

    @GetMapping("/desafio/{desafioId}")
    public ResponseEntity<?> obtenerRankingDesafio(@PathVariable Long desafioId) {
        try {
            List<RankingDTO> ranking = rankingServicio.obtenerRankingDesafio(desafioId);
            return ResponseEntity.ok(ranking);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(
                new ErrorResponse("ERROR", e.getMessage())
            );
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(
                new ErrorResponse("ERROR", "Error interno del servidor")
            );
        }
    }

    @GetMapping("/global")
    public ResponseEntity<?> obtenerRankingGlobal() {
        try {
            List<RankingDTO> ranking = rankingServicio.obtenerRankingGlobal();
            return ResponseEntity.ok(ranking);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(
                new ErrorResponse("ERROR", "Error al obtener ranking global")
            );
        }
    }

    public static class ErrorResponse {
        private String status;
        private String message;
        
        public ErrorResponse(String status, String message) {
            this.status = status;
            this.message = message;
        }
        
        public String getStatus() { return status; }
        public void setStatus(String status) { this.status = status; }
        public String getMessage() { return message; }
        public void setMessage(String message) { this.message = message; }
    }
}