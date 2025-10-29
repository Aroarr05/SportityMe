package com.aroa.sportifyme.servicio;

import com.aroa.sportifyme.modelo.Progreso;
import com.aroa.sportifyme.modelo.Usuario;
import com.aroa.sportifyme.modelo.Desafio;
import com.aroa.sportifyme.repository.ProgresoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ProgresoServicio {

    private final ProgresoRepository progresoRepository;
    private final UsuarioServicio usuarioServicio;
    private final DesafioServicio desafioServicio;

    @Transactional
    public Progreso registrarProgreso(Long usuarioId, Long desafioId, BigDecimal valorActual, 
                                     String unidad, String comentario, String dispositivo) {
        Usuario usuario = usuarioServicio.buscarPorId(usuarioId)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        
        Desafio desafio = desafioServicio.buscarPorId(desafioId);

        if (!desafioServicio.esParticipante(desafioId, usuarioId)) {
            throw new RuntimeException("El usuario no participa en este desafío");
        }

        Progreso progreso = Progreso.builder()
                .usuario(usuario)
                .desafio(desafio)
                .valorActual(valorActual)
                .unidad(unidad)
                .comentario(comentario)
                .dispositivo(dispositivo)
                .build();

        return progresoRepository.save(progreso);
    }

    @Transactional(readOnly = true)
    public List<Progreso> obtenerProgresosPorUsuarioYDesafio(Long usuarioId, Long desafioId) {
        return progresoRepository.findByUsuarioIdAndDesafioIdOrderByFechaRegistroDesc(usuarioId, desafioId);
    }

    @Transactional(readOnly = true)
    public List<Progreso> obtenerProgresosPorUsuario(Long usuarioId) {
        return progresoRepository.findByUsuarioIdOrderByFechaRegistroDesc(usuarioId);
    }

    @Transactional(readOnly = true)
    public BigDecimal obtenerProgresoTotalPorDesafio(Long usuarioId, Long desafioId) {
        return progresoRepository.findTotalProgresoByUsuarioAndDesafio(usuarioId, desafioId)
                .orElse(BigDecimal.ZERO);
    }
}