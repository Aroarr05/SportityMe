package com.aroa.sportifyme.controlador;

import com.aroa.sportifyme.modelo.Usuario;
import com.aroa.sportifyme.seguridad.dto.UsuarioDTO;
import com.aroa.sportifyme.servicio.UsuarioServicio;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/usuarios")
public class UsuarioController {

    private final UsuarioServicio usuarioServicio;

    public UsuarioController(UsuarioServicio usuarioServicio) {
        this.usuarioServicio = usuarioServicio;
    }

    @PostMapping("/registro")
    public ResponseEntity<Usuario> registrarUsuario(@Valid @RequestBody UsuarioDTO registroDTO) {
        Usuario usuario = Usuario.builder()
                .nombre(registroDTO.getNombre())
                .email(registroDTO.getEmail())
                .contraseña(registroDTO.getContraseña()) 
                .build();
        
        Usuario usuarioRegistrado = usuarioServicio.registrarUsuario(usuario);
        return ResponseEntity.status(HttpStatus.CREATED).body(usuarioRegistrado);
    }
}