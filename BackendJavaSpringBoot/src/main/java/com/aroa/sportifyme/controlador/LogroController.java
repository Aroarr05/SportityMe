package com.aroa.sportifyme.controlador;

import com.aroa.sportifyme.modelo.Logro;
import com.aroa.sportifyme.modelo.UsuarioLogro;
import com.aroa.sportifyme.servicio.LogroServicio;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/logros")
@RequiredArgsConstructor
public class LogroController {

    private final LogroServicio logroServicio;

    @PostMapping
    public ResponseEntity<Logro> crearLogro(@RequestBody Logro logro) {
        return ResponseEntity.ok(logroServicio.crearLogro(logro));
    }

    @GetMapping
    public ResponseEntity<List<Logro>> listarLogros() {
        return ResponseEntity.ok(logroServicio.listarTodosLogros());
    }

    @GetMapping("/usuario/{usuarioId}")
    public ResponseEntity<List<UsuarioLogro>> obtenerLogrosUsuario(@PathVariable Long usuarioId) {
        return ResponseEntity.ok(logroServicio.obtenerLogrosDeUsuario(usuarioId));
    }

    @PostMapping("/desbloquear")
    public ResponseEntity<Void> desbloquearLogro(
            @RequestParam Long usuarioId,
            @RequestParam String criterio) {
        logroServicio.desbloquearLogro(usuarioId, criterio);
        return ResponseEntity.ok().build();
    }
}