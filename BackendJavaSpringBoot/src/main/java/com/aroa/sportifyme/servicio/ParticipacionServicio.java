package com.aroa.sportifyme.servicio;

import com.aroa.sportifyme.modelo.*;
import com.aroa.sportifyme.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class ParticipacionServicio {

    private final ParticipacionRepositorio participacionRepositorio;
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

        Participacion participacion = Participacion.builder()
            .usuario(usuario)
            .desafio(desafio)
            .build();
        
        participacionRepositorio.save(participacion);
    }

    @Transactional
    public void abandonarDesafio(String email, Long desafioId) {
        Usuario usuario = usuarioRepositorio.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        
        participacionRepositorio.deleteByUsuarioIdAndDesafioId(usuario.getId(), desafioId);
    }
}