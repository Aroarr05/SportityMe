package com.aroa.sportifyme.controlador;

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

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    private final UsuarioServicio usuarioServicio;
    private final DesafioServicio desafioServicio;

    @GetMapping("/test")
    public ResponseEntity<String> testAdmin(Authentication authentication) {
        System.out.println("AdminController - Usuario autenticado: " + authentication.getName());
        System.out.println("AdminController - Authorities: " + authentication.getAuthorities());
        return ResponseEntity.ok("Acceso admin concedido para: " + authentication.getName());
    }

    @GetMapping("/usuarios")
    public ResponseEntity<List<Usuario>> obtenerTodosUsuarios(Authentication authentication) {
        System.out.println("AdminController/usuarios - Usuario: " + authentication.getName());
        System.out.println("AdminController/usuarios - Authorities: " + authentication.getAuthorities());
        
        List<Usuario> usuarios = usuarioServicio.obtenerTodosUsuarios();
        return ResponseEntity.ok(usuarios);
    }

    @GetMapping("/desafios")
    public ResponseEntity<List<Desafio>> obtenerTodosDesafios(Authentication authentication) {
        System.out.println("AdminController/desafios - Usuario: " + authentication.getName());
        System.out.println("AdminController/desafios - Authorities: " + authentication.getAuthorities());
        
        List<Desafio> desafios = desafioServicio.obtenerTodosDesafios();
        return ResponseEntity.ok(desafios);
    }

    @PostMapping("/usuarios")
    public ResponseEntity<Usuario> crearUsuario(@RequestBody Usuario usuario) {
        return ResponseEntity.ok(usuario);
    }

    @PutMapping("/usuarios/{id}")
    public ResponseEntity<Usuario> actualizarUsuario(@PathVariable Long id, @RequestBody Usuario usuario) {
        return ResponseEntity.ok(usuario);
    }

    @DeleteMapping("/usuarios/{id}")
    public ResponseEntity<Void> eliminarUsuario(@PathVariable Long id) {
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/desafios")
    public ResponseEntity<Desafio> crearDesafio(@RequestBody Desafio desafio) {
        return ResponseEntity.ok(desafio);
    }

    @PutMapping("/desafios/{id}")
    public ResponseEntity<Desafio> actualizarDesafio(@PathVariable Long id, @RequestBody Desafio desafio) {
        return ResponseEntity.ok(desafio);
    }

    @DeleteMapping("/desafios/{id}")
    public ResponseEntity<Void> eliminarDesafio(@PathVariable Long id) {
        return ResponseEntity.noContent().build();
    }
}