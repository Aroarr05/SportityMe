package com.aroa.sportifyme.repository;

import com.aroa.sportifyme.seguridad.dto.RankingDTO;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.Query;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Repository
@RequiredArgsConstructor
public class RankingRepository {

    @PersistenceContext
    private final EntityManager entityManager;

    @SuppressWarnings("unchecked")
    public List<RankingDTO> findGlobalRanking() {
        String sql = """
            SELECT 
                u.id as usuarioId,
                u.nombre,
                u.avatar_url as avatarUrl,
                COUNT(DISTINCT p.desafio_id) as totalDesafios,
                COALESCE(AVG(p.valor_actual / d.objetivo * 100), 0) as porcentajeCompletado
            FROM usuarios u
            LEFT JOIN progresos p ON u.id = p.usuario_id
            LEFT JOIN desafios d ON p.desafio_id = d.id AND d.estado = 'ACTIVO'
            WHERE u.activo = TRUE
            GROUP BY u.id, u.nombre, u.avatar_url
            ORDER BY porcentajeCompletado DESC, totalDesafios DESC
            """;
        
        Query query = entityManager.createNativeQuery(sql);
        List<Object[]> results = query.getResultList();
        
        return mapToRankingDTO(results);
    }

    @SuppressWarnings("unchecked")
    public List<RankingDTO> findRankingByDesafioId(Long desafioId) {
        String sql = """
            SELECT 
                u.id as usuarioId,
                u.nombre,
                u.avatar_url as avatarUrl,
                MAX(p.valor_actual) as valorActual,
                (MAX(p.valor_actual) / d.objetivo * 100) as porcentajeCompletado
            FROM progresos p
            JOIN usuarios u ON p.usuario_id = u.id
            JOIN desafios d ON p.desafio_id = d.id
            WHERE d.id = ?1 AND d.estado = 'ACTIVO'
            GROUP BY u.id, u.nombre, u.avatar_url, d.objetivo
            ORDER BY porcentajeCompletado DESC, valorActual DESC
            LIMIT 100
            """;
        
        Query query = entityManager.createNativeQuery(sql);
        query.setParameter(1, desafioId);
        List<Object[]> results = query.getResultList();
        
        return mapToRankingDTO(results);
    }

    public Long countParticipantesByDesafioId(Long desafioId) {
        String sql = """
            SELECT COUNT(DISTINCT p.usuario_id) 
            FROM progresos p
            JOIN desafios d ON p.desafio_id = d.id
            WHERE d.id = ?1 AND d.estado = 'ACTIVO'
            """;
        
        Query query = entityManager.createNativeQuery(sql);
        query.setParameter(1, desafioId);
        
        Object result = query.getSingleResult();
        return ((Number) result).longValue();
    }

    public boolean esParticipante(Long desafioId, Long usuarioId) {
        String sql = """
            SELECT COUNT(*) > 0 
            FROM progresos p
            JOIN desafios d ON p.desafio_id = d.id
            WHERE d.id = ?1 AND p.usuario_id = ?2 AND d.estado = 'ACTIVO'
            """;
        
        Query query = entityManager.createNativeQuery(sql);
        query.setParameter(1, desafioId);
        query.setParameter(2, usuarioId);
        
        Object result = query.getSingleResult();
        return ((Number) result).intValue() > 0;
    }

    private List<RankingDTO> mapToRankingDTO(List<Object[]> results) {
        List<RankingDTO> ranking = new ArrayList<>();
        
        for (Object[] row : results) {
            RankingDTO dto = new RankingDTO();
            dto.setUsuarioId(((Number) row[0]).longValue());
            dto.setNombre((String) row[1]);
            dto.setAvatarUrl((String) row[2]);
            
            if (row.length > 3 && row[3] != null) {
                dto.setTotalDesafios(((Number) row[3]).longValue());
            }
            
            if (row.length > 4 && row[4] != null) {
                dto.setPorcentajeCompletado(new BigDecimal(row[4].toString()));
            }
            
            if (row.length > 5 && row[5] != null) {
                dto.setValorActual(new BigDecimal(row[5].toString()));
            }
            
            ranking.add(dto);
        }
        
        return ranking;
    }
}