package com.aroa.sportifyme.controlador;

import com.aroa.sportifyme.modelo.Usuario;
import com.aroa.sportifyme.modelo.Rol;
import com.aroa.sportifyme.seguridad.dto.UsuarioDTO;
import com.aroa.sportifyme.servicio.UsuarioServicio;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth") 
@RequiredArgsConstructor
public class AuthController {

    private final UsuarioServicio usuarioServicio;

    @PostMapping("/register")
    public ResponseEntity<?> registrarUsuario(@Valid @RequestBody UsuarioDTO registroDTO) {
        try {
            System.out.println("Recibiendo registro para: " + registroDTO.getEmail());
            
    
            Rol rolUsuario = new Rol();
            rolUsuario.setId(2L); 
            rolUsuario.setNombre("USUARIO");
            
            Usuario usuario = Usuario.builder()
                    .nombre(registroDTO.getNombre())
                    .email(registroDTO.getEmail())
                    .contraseña(registroDTO.getContraseña()) 
                    .rol(rolUsuario) 
                    .build();
            
            System.out.println("👤 Usuario creado, procediendo a registrar...");
            Usuario usuarioRegistrado = usuarioServicio.registrarUsuario(usuario);
            System.out.println("Usuario registrado con ID: " + usuarioRegistrado.getId());
            
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Usuario registrado exitosamente");
            
            Map<String, Object> userResponse = new HashMap<>();
            userResponse.put("id", usuarioRegistrado.getId());
            userResponse.put("nombre", usuarioRegistrado.getNombre());
            userResponse.put("email", usuarioRegistrado.getEmail());
            userResponse.put("avatarUrl", usuarioRegistrado.getAvatarUrl());
            userResponse.put("rol", usuarioRegistrado.getRol().getNombre()); 
            userResponse.put("fechaRegistro", usuarioRegistrado.getFechaRegistro());
            
            response.put("user", userResponse);
            response.put("token", "jwt-token-simulado-" + usuarioRegistrado.getId());
            
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
            
        } catch (Exception e) {
            System.err.println("Error en registro: " + e.getMessage());
            e.printStackTrace();
            
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", "Error en el registro");
            errorResponse.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> loginUsuario(@Valid @RequestBody LoginRequest loginRequest) {
        try {
            System.out.println("Intentando login para: " + loginRequest.getEmail());
        
            var usuarioOpt = usuarioServicio.buscarPorEmail(loginRequest.getEmail());
            
            if (usuarioOpt.isEmpty()) {
                Map<String, String> errorResponse = new HashMap<>();
                errorResponse.put("error", "Credenciales inválidas");
                errorResponse.put("message", "Usuario no encontrado");
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(errorResponse);
            }
            
            Usuario usuario = usuarioOpt.get();
            
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Login exitoso");
            
            Map<String, Object> userResponse = new HashMap<>();
            userResponse.put("id", usuario.getId());
            userResponse.put("nombre", usuario.getNombre());
            userResponse.put("email", usuario.getEmail());
            userResponse.put("rol", usuario.getRol().getNombre());
            userResponse.put("fechaRegistro", usuario.getFechaRegistro());
            userResponse.put("avatarUrl", usuario.getAvatarUrl());
            
            response.put("user", userResponse);
            response.put("token", "jwt-token-simulado-" + usuario.getId());
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            System.err.println("Error en login: " + e.getMessage());
            
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", "Error en el login");
            errorResponse.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(errorResponse);
        }
    }
}

class LoginRequest {
    private String email;
    private String password;

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
}