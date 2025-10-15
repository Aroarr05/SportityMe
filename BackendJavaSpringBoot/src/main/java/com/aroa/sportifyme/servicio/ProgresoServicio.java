package com.aroa.sportifyme.servicio;


import com.aroa.sportifyme.seguridad.dto.RankingDTO;
import com.aroa.sportifyme.modelo.*;
import com.aroa.sportifyme.repository.ProgresoRepository;
import com.aroa.sportifyme.seguridad.dto.ProgresoDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProgresoServicio {

    private final ProgresoRepository progresoRepository;
    private final UsuarioServicio usuarioServicio;
    private final DesafioServicio desafioServicio;
    private final ParticipacionServicio participacionServicio;

    @Transactional
    public Progreso registrarProgreso(ProgresoDTO progresoDTO, String emailUsuario) {
        Usuario usuario = usuarioServicio.buscarPorEmail(emailUsuario)
                .orElseThrow(() -> new IllegalArgumentException("Usuario no encontrado"));

        Desafio desafio = desafioServicio.buscarPorId(progresoDTO.getDesafioId());
        if (desafio == null) {
            throw new IllegalArgumentException("Desafío no encontrado");
        }

        if (!participacionServicio.usuarioParticipaEnDesafio(usuario.getId(), desafio.getId())) {
            throw new IllegalArgumentException("El usuario no está participando en este desafío");
        }

        if (LocalDateTime.now().isAfter(desafio.getFechaFin())) {
            throw new IllegalArgumentException("El desafío ya ha finalizado");
        }

        Progreso progreso = new Progreso();
        progreso.setValorActual(progresoDTO.getValorActual());
        progreso.setUnidad(progresoDTO.getUnidad());
        progreso.setComentario(progresoDTO.getComentario());
        progreso.setUsuario(usuario);
        progreso.setDesafio(desafio);
        progreso.setDispositivo(progresoDTO.getDispositivo());

        return progresoRepository.save(progreso);
    }

    @Transactional(readOnly = true)
    public List<Progreso> obtenerProgresosPorDesafio(Long desafioId) {
        return progresoRepository.findByDesafioIdWithUsuarioAndDesafio(desafioId);
    }

    @Transactional(readOnly = true)
    public List<RankingDTO> generarRankingDesafio(Long desafioId) {
        return progresoRepository.findRankingByDesafioId(desafioId).stream()
                .map(progreso -> new RankingDTO(
                        progreso.getUsuario().getId(),
                        progreso.getUsuario().getNombre(),
                        progreso.getValorActual(),
                        progreso.getUsuario().getAvatarUrl()
                ))
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public Optional<Progreso> buscarProgresoPorId(Long id) {
        return progresoRepository.findByIdWithUsuarioAndDesafio(id);
    }
}