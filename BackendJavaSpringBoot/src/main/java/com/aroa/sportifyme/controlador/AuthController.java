package com.aroa.sportifyme.controlador;

import com.aroa.sportifyme.modelo.Usuario;
import com.aroa.sportifyme.modelo.Rol;
import com.aroa.sportifyme.seguridad.dto.UsuarioDTO;
import com.aroa.sportifyme.seguridad.jwt.JwtTokenProvider;
import com.aroa.sportifyme.servicio.UsuarioServicio;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final UsuarioServicio usuarioServicio;
    private final JwtTokenProvider jwtTokenProvider;
    private final AuthenticationManager authenticationManager;

    @PostMapping("/register")
    public ResponseEntity<?> registrarUsuario(@Valid @RequestBody UsuarioDTO registroDTO) {
        try {
            Rol rolUsuario = new Rol();
            rolUsuario.setId(2L);
            rolUsuario.setNombre("USUARIO");

            Usuario usuario = Usuario.builder()
                    .nombre(registroDTO.getNombre())
                    .email(registroDTO.getEmail())
                    .contraseña(registroDTO.getContraseña())
                    .rol(rolUsuario)
                    .build();

            Usuario usuarioRegistrado = usuarioServicio.registrarUsuario(usuario);

            UserDetails userDetails = usuarioServicio.loadUserByUsername(usuarioRegistrado.getEmail());
            String jwtToken = jwtTokenProvider.generarToken(userDetails);

            Map<String, Object> response = new HashMap<>();
            response.put("message", "Usuario registrado exitosamente");

            Map<String, Object> userResponse = new HashMap<>();
            userResponse.put("id", usuarioRegistrado.getId());
            userResponse.put("nombre", usuarioRegistrado.getNombre());
            userResponse.put("email", usuarioRegistrado.getEmail());
            userResponse.put("avatarUrl", usuarioRegistrado.getAvatarUrl());
            userResponse.put("rol", usuarioRegistrado.getRol().getNombre());
            userResponse.put("rol_id", usuarioRegistrado.getRol().getId());
            userResponse.put("fechaRegistro", usuarioRegistrado.getFechaRegistro());

            response.put("user", userResponse);
            response.put("token", jwtToken);

            return ResponseEntity.status(HttpStatus.CREATED).body(response);

        } catch (Exception e) {
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", "Error en el registro");
            errorResponse.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> loginUsuario(@Valid @RequestBody LoginRequest loginRequest) {
        try {
            var usuarioOpt = usuarioServicio.buscarPorEmail(loginRequest.getEmail());
            if (usuarioOpt.isEmpty()) {
                Map<String, String> errorResponse = new HashMap<>();
                errorResponse.put("error", "Credenciales inválidas");
                errorResponse.put("message", "Usuario no encontrado");
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(errorResponse);
            }

            Usuario usuario = usuarioOpt.get();
            boolean passwordValida = usuarioServicio.verificarPassword(loginRequest.getEmail(),
                    loginRequest.getPassword());

            if (!passwordValida) {
                Map<String, String> errorResponse = new HashMap<>();
                errorResponse.put("error", "Credenciales inválidas");
                errorResponse.put("message", "Contraseña incorrecta");
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(errorResponse);
            }

            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            loginRequest.getEmail(),
                            loginRequest.getPassword()));

            SecurityContextHolder.getContext().setAuthentication(authentication);

            String jwtToken = jwtTokenProvider.generarToken(authentication);

            Map<String, Object> response = new HashMap<>();
            response.put("message", "Login exitoso");

            Map<String, Object> userResponse = new HashMap<>();
            userResponse.put("id", usuario.getId());
            userResponse.put("nombre", usuario.getNombre());
            userResponse.put("email", usuario.getEmail());
            userResponse.put("rol", usuario.getRol().getNombre());
            userResponse.put("rol_id", usuario.getRol().getId());
            userResponse.put("fechaRegistro", usuario.getFechaRegistro());
            userResponse.put("avatarUrl", usuario.getAvatarUrl());

            response.put("user", userResponse);
            response.put("token", jwtToken);

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", "Error en el login");
            errorResponse.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(errorResponse);
        }
    }

    @GetMapping("/perfil")
    public ResponseEntity<?> getPerfilUsuario(Authentication authentication) {
        try {
            String email = authentication.getName();
            Optional<Usuario> usuarioOpt = usuarioServicio.buscarPorEmail(email);

            if (usuarioOpt.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(Map.of("error", "Usuario no encontrado"));
            }

            Usuario usuario = usuarioOpt.get();
            Map<String, Object> userResponse = new HashMap<>();

            userResponse.put("id", usuario.getId());
            userResponse.put("nombre", usuario.getNombre());
            userResponse.put("email", usuario.getEmail());
            userResponse.put("rol_id", usuario.getRol().getId());
            userResponse.put("rol", usuario.getRol().getNombre());

            userResponse.put("avatar_url", usuario.getAvatarUrl());
            userResponse.put("avatarUrl", usuario.getAvatarUrl()); 
            userResponse.put("biografia", usuario.getBiografia());
            userResponse.put("ubicacion", usuario.getUbicacion());
            userResponse.put("fecha_nacimiento",
                    usuario.getFechaNacimiento() != null ? usuario.getFechaNacimiento().toString() : null);
            userResponse.put("genero",
                    usuario.getGenero() != null ? usuario.getGenero().name() : null);
            userResponse.put("peso", usuario.getPeso());
            userResponse.put("altura", usuario.getAltura());
            userResponse.put("fecha_registro",
                    usuario.getFechaRegistro() != null ? usuario.getFechaRegistro().toString() : null);
            userResponse.put("fechaRegistro",
                    usuario.getFechaRegistro() != null ? usuario.getFechaRegistro().toString() : null); 
                                                                                                        
            userResponse.put("ultimo_login",
                    usuario.getUltimoLogin() != null ? usuario.getUltimoLogin().toString() : null);
            userResponse.put("activo", usuario.getActivo());

            return ResponseEntity.ok(userResponse);

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Error al obtener perfil"));
        }
    }

    @PutMapping("/perfil")
    public ResponseEntity<?> updatePerfil(@RequestBody Map<String, Object> updates, Authentication authentication) {
        try {
            String email = authentication.getName();
            Optional<Usuario> usuarioOpt = usuarioServicio.buscarPorEmail(email);

            if (usuarioOpt.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(Map.of("error", "Usuario no encontrado"));
            }

            Usuario usuario = usuarioOpt.get();

            if (updates.containsKey("nombre")) {
                usuario.setNombre((String) updates.get("nombre"));
            }
            if (updates.containsKey("biografia")) {
                usuario.setBiografia((String) updates.get("biografia"));
            }
            if (updates.containsKey("ubicacion")) {
                usuario.setUbicacion((String) updates.get("ubicacion"));
            }
            if (updates.containsKey("fecha_nacimiento")) {
                String fechaNacimientoStr = (String) updates.get("fecha_nacimiento");
                if (fechaNacimientoStr != null && !fechaNacimientoStr.isEmpty()) {
                    usuario.setFechaNacimiento(LocalDate.parse(fechaNacimientoStr));
                } else {
                    usuario.setFechaNacimiento(null);
                }
            }
            if (updates.containsKey("genero")) {
                String generoStr = (String) updates.get("genero");
                if (generoStr != null && !generoStr.isEmpty()) {
                    try {
                        usuario.setGenero(Usuario.Genero.valueOf(generoStr.toUpperCase()));
                    } catch (IllegalArgumentException e) {
                    }
                } else {
                    usuario.setGenero(null);
                }
            }
            if (updates.containsKey("peso")) {
                Object pesoObj = updates.get("peso");
                if (pesoObj != null) {
                    if (pesoObj instanceof Number) {
                        usuario.setPeso(BigDecimal.valueOf(((Number) pesoObj).doubleValue()));
                    } else if (pesoObj instanceof String && !((String) pesoObj).isEmpty()) {
                        usuario.setPeso(new BigDecimal((String) pesoObj));
                    } else {
                        usuario.setPeso(null);
                    }
                } else {
                    usuario.setPeso(null);
                }
            }
            if (updates.containsKey("altura")) {
                Object alturaObj = updates.get("altura");
                if (alturaObj != null) {
                    if (alturaObj instanceof Number) {
                        usuario.setAltura(((Number) alturaObj).intValue());
                    } else if (alturaObj instanceof String && !((String) alturaObj).isEmpty()) {
                        usuario.setAltura(Integer.parseInt((String) alturaObj));
                    } else {
                        usuario.setAltura(null);
                    }
                } else {
                    usuario.setAltura(null);
                }
            }
            if (updates.containsKey("avatar_url")) {
                usuario.setAvatarUrl((String) updates.get("avatar_url"));
            }

            Usuario usuarioActualizado = usuarioServicio.actualizarUsuario(usuario);

            Map<String, Object> userResponse = new HashMap<>();
            userResponse.put("id", usuarioActualizado.getId());
            userResponse.put("nombre", usuarioActualizado.getNombre());
            userResponse.put("email", usuarioActualizado.getEmail());
            userResponse.put("avatar_url", usuarioActualizado.getAvatarUrl());
            userResponse.put("biografia", usuarioActualizado.getBiografia());
            userResponse.put("ubicacion", usuarioActualizado.getUbicacion());
            userResponse.put("fecha_nacimiento",
                    usuarioActualizado.getFechaNacimiento() != null ? usuarioActualizado.getFechaNacimiento().toString()
                            : null);
            userResponse.put("genero",
                    usuarioActualizado.getGenero() != null ? usuarioActualizado.getGenero().name() : null);
            userResponse.put("peso",
                    usuarioActualizado.getPeso() != null ? usuarioActualizado.getPeso().doubleValue() : null);
            userResponse.put("altura", usuarioActualizado.getAltura());
            userResponse.put("fecha_registro",
                    usuarioActualizado.getFechaRegistro() != null ? usuarioActualizado.getFechaRegistro().toString()
                            : null);
            userResponse.put("ultimo_login",
                    usuarioActualizado.getUltimoLogin() != null ? usuarioActualizado.getUltimoLogin().toString()
                            : null);
            userResponse.put("activo", usuarioActualizado.getActivo());
            userResponse.put("rol_id", usuarioActualizado.getRol().getId());

            return ResponseEntity.ok(userResponse);

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Error al actualizar perfil: " + e.getMessage()));
        }
    }

    static class LoginRequest {
        private String email;
        private String password;

        public String getEmail() {
            return email;
        }

        public void setEmail(String email) {
            this.email = email;
        }

        public String getPassword() {
            return password;
        }

        public void setPassword(String password) {
            this.password = password;
        }
    }
}