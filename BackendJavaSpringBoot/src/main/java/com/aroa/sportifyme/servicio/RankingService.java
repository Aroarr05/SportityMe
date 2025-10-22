package com.aroa.sportifyme.servicio;

import com.aroa.sportifyme.seguridad.dto.RankingDTO;
import com.aroa.sportifyme.repository.RankingRepository;
import com.aroa.sportifyme.repository.DesafiosCompletadosRepository;
import com.aroa.sportifyme.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class RankingService {

    private final RankingRepository rankingRepository;
    private final DesafiosCompletadosRepository desafiosCompletadosRepository;
    private final UsuarioRepository usuarioRepository;

    public List<RankingDTO> obtenerRankingGlobal() {
        try {
            return rankingRepository.findGlobalRanking();
        } catch (Exception e) {
            return usuarioRepository.findAll().stream()
                    .map(usuario -> {
                        Integer totalCompletados = desafiosCompletadosRepository
                                .countDesafiosCompletadosByUsuario(usuario.getId());

                        String nombre = usuario.getNombre() != null ? usuario.getNombre() : "Anónimo";
                        String avatarUrl = usuario.getAvatarUrl() != null ? usuario.getAvatarUrl() : ""; 
                        Long completedChallenges = totalCompletados != null ? totalCompletados.longValue() : 0L;

                        return new RankingDTO(
                                usuario.getId(),
                                nombre,
                                avatarUrl,
                                completedChallenges
                        );
                    })
                    .sorted((r1, r2) -> r2.getTotalDesafiosCompletados().compareTo(r1.getTotalDesafiosCompletados())) // CORREGIDO
                    .collect(Collectors.toList());
        }
    }

    public List<RankingDTO> obtenerRankingGlobalConLimite(Integer limit) {
        List<RankingDTO> ranking = obtenerRankingGlobal();
        for (int i = 0; i < ranking.size(); i++) {
            ranking.get(i).setPosicion(i + 1);
        }
        
        if (limit != null && limit > 0 && ranking.size() > limit) {
            return ranking.subList(0, limit);
        }
        return ranking;
    }

    public List<RankingDTO> obtenerRankingPorDesafio(Long desafioId) {
        List<RankingDTO> ranking = rankingRepository.findRankingByDesafioId(desafioId);

        for (int i = 0; i < ranking.size(); i++) {
            ranking.get(i).setPosicion(i + 1);
        }
        
        return ranking;
    }

    public Long obtenerTotalParticipantesDesafio(Long desafioId) {
        return rankingRepository.countParticipantesByDesafioId(desafioId);
    }

    public boolean esUsuarioParticipante(Long desafioId, Long usuarioId) {
        return rankingRepository.esParticipante(desafioId, usuarioId);
    }
}