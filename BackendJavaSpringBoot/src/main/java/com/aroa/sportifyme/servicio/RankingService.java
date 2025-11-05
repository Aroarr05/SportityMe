package com.aroa.sportifyme.servicio;

import com.aroa.sportifyme.seguridad.dto.RankingDTO;
import com.aroa.sportifyme.repository.RankingRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;


@Service
@RequiredArgsConstructor
@Transactional
public class RankingService {

    private final RankingRepository rankingRepository;

    public List<RankingDTO> obtenerRankingGlobal() {
        try {
            List<RankingDTO> ranking = rankingRepository.findGlobalRanking();
            for (int i = 0; i < ranking.size(); i++) {
                ranking.get(i).setPosicion(i + 1);
            }
            return ranking;
        } catch (Exception e) {
            throw new RuntimeException("Error al obtener ranking global: " + e.getMessage());
        }
    }

    public List<RankingDTO> obtenerRankingGlobalConLimite(Integer limit) {
        List<RankingDTO> ranking = obtenerRankingGlobal();
        
        if (limit != null && limit > 0 && ranking.size() > limit) {
            return ranking.subList(0, limit);
        }
        return ranking;
    }

    public List<RankingDTO> obtenerRankingPorDesafio(Long desafioId) {
        try {
            List<RankingDTO> ranking = rankingRepository.findRankingByDesafioId(desafioId);
            for (int i = 0; i < ranking.size(); i++) {
                ranking.get(i).setPosicion(i + 1);
            }
            return ranking;
        } catch (Exception e) {
            throw new RuntimeException("Error al obtener ranking por desafío: " + e.getMessage());
        }
    }

    public List<RankingDTO> obtenerRankingPorDesafioConLimite(Long desafioId, Integer limit) {
        List<RankingDTO> ranking = obtenerRankingPorDesafio(desafioId);
        
        if (limit != null && limit > 0 && ranking.size() > limit) {
            return ranking.subList(0, limit);
        }
        return ranking;
    }

    public Long obtenerTotalParticipantesDesafio(Long desafioId) {
        try {
            return rankingRepository.countParticipantesByDesafioId(desafioId);
        } catch (Exception e) {
            throw new RuntimeException("Error al obtener total participantes: " + e.getMessage());
        }
    }

    public boolean esUsuarioParticipante(Long desafioId, Long usuarioId) {
        try {
            return rankingRepository.esParticipante(desafioId, usuarioId);
        } catch (Exception e) {
            throw new RuntimeException("Error al verificar participación: " + e.getMessage());
        }
    }
}