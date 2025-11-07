package com.aroa.sportifyme.controlador;

import com.aroa.sportifyme.seguridad.dto.UsuarioDTO;
import com.aroa.sportifyme.seguridad.dto.DesafioDTO;
import com.aroa.sportifyme.modelo.Usuario;
import com.aroa.sportifyme.modelo.Desafio;
import com.aroa.sportifyme.servicio.UsuarioServicio;
import com.aroa.sportifyme.servicio.DesafioServicio;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    private final UsuarioServicio usuarioServicio;
    private final DesafioServicio desafioServicio;

    @GetMapping("/test")
    public ResponseEntity<String> testAdmin(Authentication authentication) {
        return ResponseEntity.ok("Acceso admin concedido para: " + authentication.getName());
    }

    @GetMapping("/usuarios")
    public ResponseEntity<List<UsuarioDTO>> obtenerTodosUsuarios(Authentication authentication) {
        List<Usuario> usuarios = usuarioServicio.obtenerTodosUsuarios();
        List<UsuarioDTO> usuariosDTO = usuarios.stream()
                .map(this::convertirAUsuarioDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(usuariosDTO);
    }

    @GetMapping("/desafios")
    public ResponseEntity<List<DesafioDTO>> obtenerTodosDesafios(Authentication authentication) {
        List<Desafio> desafios = desafioServicio.obtenerTodosDesafios();
        List<DesafioDTO> desafiosDTO = desafios.stream()
                .map(DesafioDTO::fromEntity)
                .collect(Collectors.toList());
        return ResponseEntity.ok(desafiosDTO);
    }

    private UsuarioDTO convertirAUsuarioDTO(Usuario usuario) {
        UsuarioDTO dto = new UsuarioDTO();
        dto.setId(usuario.getId());
        dto.setNombre(usuario.getNombre());
        dto.setEmail(usuario.getEmail());
        dto.setAvatarUrl(usuario.getAvatarUrl());
        
        if (usuario.getRol() != null && usuario.getRol().getNombre() != null) {
            dto.setRol(usuario.getRol().getNombre());
        }
        
        dto.setFechaRegistro(usuario.getFechaRegistro());
        dto.setUltimoLogin(usuario.getUltimoLogin());
        dto.setBiografia(usuario.getBiografia());
        dto.setUbicacion(usuario.getUbicacion());
        dto.setFechaNacimiento(usuario.getFechaNacimiento());
        
        if (usuario.getGenero() != null) {
            dto.setGenero(usuario.getGenero().name().toLowerCase());
        }
        
        if (usuario.getPeso() != null) {
            dto.setPeso(usuario.getPeso().doubleValue());
        }
        
        dto.setAltura(usuario.getAltura());
        
        return dto;
    }

    @PostMapping("/usuarios")
    public ResponseEntity<UsuarioDTO> crearUsuario(@RequestBody UsuarioDTO usuarioDTO) {
        return ResponseEntity.ok(usuarioDTO);
    }

    @PutMapping("/usuarios/{id}")
    public ResponseEntity<UsuarioDTO> actualizarUsuario(@PathVariable Long id, @RequestBody UsuarioDTO usuarioDTO) {
        return ResponseEntity.ok(usuarioDTO);
    }

    @DeleteMapping("/usuarios/{id}")
    public ResponseEntity<Void> eliminarUsuario(@PathVariable Long id) {
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/desafios")
    public ResponseEntity<DesafioDTO> crearDesafio(@RequestBody DesafioDTO desafioDTO) {
        return ResponseEntity.ok(desafioDTO);
    }

    @PutMapping("/desafios/{id}")
    public ResponseEntity<DesafioDTO> actualizarDesafio(@PathVariable Long id, @RequestBody DesafioDTO desafioDTO) {
        return ResponseEntity.ok(desafioDTO);
    }

    @DeleteMapping("/desafios/{id}")
    public ResponseEntity<Void> eliminarDesafio(@PathVariable Long id) {
        return ResponseEntity.noContent().build();
    }
}