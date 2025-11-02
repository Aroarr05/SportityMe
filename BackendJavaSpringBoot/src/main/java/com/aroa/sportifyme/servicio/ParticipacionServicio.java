package com.aroa.sportifyme.servicio;

import com.aroa.sportifyme.modelo.Desafio;
import com.aroa.sportifyme.modelo.Participacion;
import com.aroa.sportifyme.modelo.Usuario;
import com.aroa.sportifyme.repository.DesafioRepository;
import com.aroa.sportifyme.repository.ParticipacionRepository;
import com.aroa.sportifyme.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class ParticipacionServicio {

    private final ParticipacionRepository participacionRepositorio;
    private final UsuarioRepository usuarioRepositorio;
    private final DesafioRepository desafioRepositorio;

    public boolean verificarParticipacion(String email, Long desafioId) {
        Usuario usuario = usuarioRepositorio.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        
        return participacionRepositorio.existsByUsuarioIdAndDesafioId(usuario.getId(), desafioId);
    }

    @Transactional
    public void unirseADesafio(String email, Long desafioId) {
        Usuario usuario = usuarioRepositorio.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        Desafio desafio = desafioRepositorio.findById(desafioId)
                .orElseThrow(() -> new RuntimeException("Desafío no encontrado"));

        if (participacionRepositorio.existsByUsuarioIdAndDesafioId(usuario.getId(), desafioId)) {
            throw new RuntimeException("Ya estás participando en este desafío");
        }

        if (desafio.getMaxParticipantes() != null) {
            long participantesActuales = participacionRepositorio.countByDesafioId(desafioId);
            if (participantesActuales >= desafio.getMaxParticipantes()) {
                throw new RuntimeException("El desafío ha alcanzado el límite de participantes");
            }
        }
        Participacion participacion = Participacion.builder()
                .usuario(usuario)
                .desafio(desafio)
                .fechaUnion(LocalDateTime.now())
                .build();

        participacionRepositorio.save(participacion);
    }

    @Transactional
    public void abandonarDesafio(String email, Long desafioId) {
        Usuario usuario = usuarioRepositorio.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        if (!participacionRepositorio.existsByUsuarioIdAndDesafioId(usuario.getId(), desafioId)) {
            throw new RuntimeException("No estás participando en este desafío");
        }


        participacionRepositorio.deleteByUsuarioIdAndDesafioId(usuario.getId(), desafioId);
    }
}