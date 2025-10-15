package com.aroa.sportifyme.controlador;

import com.aroa.sportifyme.modelo.Comentario;
import com.aroa.sportifyme.servicio.ComentarioServicio;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/comentarios")
@RequiredArgsConstructor
public class ComentarioController {

    private final ComentarioServicio comentarioServicio;

    @PostMapping("/desafio/{desafioId}")
    public ResponseEntity<Comentario> crearComentario(
            @PathVariable Long desafioId,
            @RequestBody String contenido,
            Authentication authentication) {

        Comentario comentario = comentarioServicio.crearComentario(
                desafioId,
                contenido,
                authentication.getName());

        return ResponseEntity.ok(comentario);
    }

    @GetMapping("/desafio/{desafioId}")
    public ResponseEntity<List<Comentario>> obtenerComentariosPorDesafio(
            @PathVariable Long desafioId) {

        return ResponseEntity.ok(
                comentarioServicio.obtenerComentariosPorDesafio(desafioId));
    }

    @DeleteMapping("/{comentarioId}")
    public ResponseEntity<Void> eliminarComentario(
            @PathVariable Long comentarioId,
            Authentication authentication) {

        comentarioServicio.eliminarComentario(comentarioId, authentication.getName());
        return ResponseEntity.noContent().build();
    }
}