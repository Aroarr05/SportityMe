package com.aroa.sportifyme.servicio;

import com.aroa.sportifyme.modelo.Progreso;
import com.aroa.sportifyme.modelo.Desafio;
import com.aroa.sportifyme.modelo.Usuario;
import com.aroa.sportifyme.repository.ProgresoRepository;
import com.aroa.sportifyme.repository.DesafioRepository;
import com.aroa.sportifyme.repository.UsuarioRepository;
import com.aroa.sportifyme.seguridad.dto.ProgresoDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Transactional
public class ProgresoService {

    private final ProgresoRepository progresoRepository;
    private final DesafioRepository desafioRepository;
    private final UsuarioRepository usuarioRepository;

    public Progreso registrarProgreso(ProgresoDTO progresoDTO, Long usuarioId) {
        Optional<Desafio> desafioOpt = desafioRepository.findById(progresoDTO.getDesafioId());
        Optional<Usuario> usuarioOpt = usuarioRepository.findById(usuarioId);

        if (desafioOpt.isPresent() && usuarioOpt.isPresent()) {
            Desafio desafio = desafioOpt.get();
            Usuario usuario = usuarioOpt.get();
            
            if (!progresoDTO.getUnidad().equals(desafio.getUnidadObjetivo())) {
                throw new IllegalArgumentException("La unidad del progreso debe coincidir con la unidad del desafío: " + desafio.getUnidadObjetivo());
            }
            
            Progreso progreso = Progreso.builder()
                    .usuario(usuario)
                    .desafio(desafio)
                    .valorActual(progresoDTO.getValorActual())
                    .unidad(progresoDTO.getUnidad())
                    .comentario(progresoDTO.getComentario())
                    .dispositivo(progresoDTO.getDispositivo())
                    .fechaRegistro(LocalDateTime.now())
                    .build();

            Progreso progresoGuardado = progresoRepository.save(progreso);
            
          
            if (progreso.estaCompletado()) {
                System.out.println("¡Desafío completado por el usuario " + usuario.getNombre() + "!");
            }
            
            return progresoGuardado;
        }
        throw new RuntimeException("Desafío o usuario no encontrado");
    }

    public List<Progreso> obtenerProgresoPorUsuarioYDesafio(Long usuarioId, Long desafioId) {
        return progresoRepository.findByUsuarioIdAndDesafioId(usuarioId, desafioId);
    }

    public BigDecimal obtenerProgresoActual(Long usuarioId, Long desafioId) {
        return progresoRepository.findLatestByUsuarioAndDesafio(usuarioId, desafioId)
                .map(Progreso::getValorActual)
                .orElse(BigDecimal.ZERO);
    }

    public BigDecimal obtenerMejorProgreso(Long usuarioId, Long desafioId) {
        return progresoRepository.findMaxProgresoByUsuarioAndDesafio(usuarioId, desafioId)
                .map(Progreso::getValorActual)
                .orElse(BigDecimal.ZERO);
    }

    public List<Progreso> obtenerRankingPorDesafio(Long desafioId) {
        return progresoRepository.findRankingByDesafioId(desafioId);
    }

    public Integer contarDesafiosCompletados(Long usuarioId) {
        return progresoRepository.countDesafiosCompletadosByUsuario(usuarioId);
    }

    public BigDecimal calcularPorcentajeCompletado(Long usuarioId, Long desafioId) {
        return progresoRepository.calcularProgresoUsuarioDesafio(usuarioId, desafioId)
                .orElse(BigDecimal.ZERO);
    }
}