package com.aroa.sportifyme.controlador;

import com.aroa.sportifyme.seguridad.dto.RankingDTO;
import com.aroa.sportifyme.servicio.RankingServicio;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/ranking")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:4200")
public class RankingController {
    
    private final RankingServicio rankingServicio;
    
    @GetMapping("/desafios-completados")
    public ResponseEntity<List<RankingDTO>> getRankingDesafiosCompletados() {
        try {
            List<RankingDTO> ranking = rankingServicio.getRankingDesafiosCompletados();
            return ResponseEntity.ok(ranking);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    @GetMapping("/desafios-completados/top/{limit}")
    public ResponseEntity<List<RankingDTO>> getTopRankingDesafiosCompletados(@PathVariable int limit) {
        try {
            List<RankingDTO> ranking = rankingServicio.getRankingDesafiosCompletados();
            List<RankingDTO> topRanking = ranking.stream()
                .limit(limit)
                .collect(Collectors.toList());
            return ResponseEntity.ok(topRanking);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}