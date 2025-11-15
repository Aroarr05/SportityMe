package com.aroa.sportifyme.controlador;

import com.aroa.sportifyme.seguridad.dto.UsuarioDTO;
import com.aroa.sportifyme.seguridad.dto.DesafioDTO;
import com.aroa.sportifyme.modelo.Usuario;
import com.aroa.sportifyme.modelo.Desafio;
import com.aroa.sportifyme.modelo.Rol;
import com.aroa.sportifyme.servicio.UsuarioServicio;
import com.aroa.sportifyme.servicio.DesafioServicio;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.regex.Pattern;
import java.util.regex.Matcher;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    private final UsuarioServicio usuarioServicio;
    private final DesafioServicio desafioServicio;
    private static final Logger logger = LoggerFactory.getLogger(AdminController.class);

    @GetMapping("/test")
    public ResponseEntity<String> testAdmin(Authentication authentication) {
        return ResponseEntity.ok("Acceso admin concedido para: " + authentication.getName());
    }

    @GetMapping("/usuarios")
    public ResponseEntity<List<UsuarioDTO>> obtenerTodosUsuarios(Authentication authentication) {
        try {
            List<Usuario> usuarios = usuarioServicio.obtenerTodosUsuarios();
            List<UsuarioDTO> usuariosDTO = usuarios.stream()
                    .map(this::convertirAUsuarioDTO)
                    .collect(Collectors.toList());
            return ResponseEntity.ok(usuariosDTO);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @PostMapping("/usuarios")
public ResponseEntity<?> crearUsuario(@RequestBody UsuarioDTO usuarioDTO, BindingResult result) {
    try {
        if (result.hasErrors()) {
            Map<String, String> errores = new HashMap<>();
            result.getFieldErrors().forEach(error -> {
                errores.put(error.getField(), error.getDefaultMessage());
            });
            return ResponseEntity.badRequest().body(errores);
        }
        
        // Validaciones básicas
        if (usuarioDTO.getEmail() == null || usuarioDTO.getEmail().trim().isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "El email es obligatorio"));
        }
        if (usuarioDTO.getContraseña() == null || usuarioDTO.getContraseña().trim().isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "La contraseña es obligatoria"));
        }

        // Validar formato de email
        if (!isValidEmail(usuarioDTO.getEmail())) {
            return ResponseEntity.badRequest().body(Map.of("error", "Formato de email inválido"));
        }

        // Verificar si el email ya existe
        if (usuarioServicio.existeUsuarioPorEmail(usuarioDTO.getEmail())) {
            return ResponseEntity.badRequest().body(Map.of("error", "El email ya está registrado"));
        }

        // Crear y configurar el usuario
        Usuario usuario = new Usuario();
        usuario.setNombre(usuarioDTO.getNombre() != null ? usuarioDTO.getNombre().trim() : "Usuario");
        usuario.setEmail(usuarioDTO.getEmail().toLowerCase().trim());
        usuario.setContraseña(usuarioDTO.getContraseña());
        usuario.setAvatarUrl(usuarioDTO.getAvatarUrl());
        usuario.setBiografia(usuarioDTO.getBiografia());
        usuario.setUbicacion(usuarioDTO.getUbicacion());
        usuario.setFechaNacimiento(usuarioDTO.getFechaNacimiento());
        
        // Configurar género
        if (usuarioDTO.getGenero() != null && !usuarioDTO.getGenero().trim().isEmpty()) {
            try {
                usuario.setGenero(Usuario.Genero.valueOf(usuarioDTO.getGenero().toUpperCase()));
            } catch (IllegalArgumentException e) {
                usuario.setGenero(Usuario.Genero.NO_ESPECIFICADO);
            }
        } else {
            usuario.setGenero(Usuario.Genero.NO_ESPECIFICADO);
        }
        
        // Configurar peso y altura
        if (usuarioDTO.getPeso() != null) {
            usuario.setPeso(BigDecimal.valueOf(usuarioDTO.getPeso()));
        }
        usuario.setAltura(usuarioDTO.getAltura());
        
        // Configuraciones por defecto
        usuario.setActivo(true);
        usuario.setFechaRegistro(LocalDateTime.now());

        // ASIGNAR ROL POR DEFECTO - CREAR OBJETO ROL MÍNIMO
        Rol rolUsuario = new Rol();
        rolUsuario.setId(2L); // 2 = USUARIO (asegúrate que este ID existe en tu tabla roles)
        usuario.setRol(rolUsuario);

        Usuario usuarioCreado = usuarioServicio.registrarUsuario(usuario);
        UsuarioDTO respuestaDTO = convertirAUsuarioDTO(usuarioCreado);
        
        return ResponseEntity.ok(respuestaDTO);
        
    } catch (Exception e) {
        logger.error("Error al crear usuario", e);
        return ResponseEntity.badRequest().body(Map.of("error", "Error al crear usuario: " + e.getMessage()));
    }
}
    // Método para validar formato de email
    private boolean isValidEmail(String email) {
        if (email == null) return false;
        
        String emailRegex = "^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$";
        Pattern pattern = Pattern.compile(emailRegex);
        Matcher matcher = pattern.matcher(email.toLowerCase().trim());
        
        return matcher.matches();
    }

    @PutMapping("/usuarios/{id}")
    public ResponseEntity<?> actualizarUsuario(@PathVariable Long id, @RequestBody UsuarioDTO usuarioDTO) {
        try {
            Usuario usuarioExistente = usuarioServicio.obtenerUsuarioPorId(id)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado con ID: " + id));
            
            if (usuarioDTO.getEmail() != null && !usuarioDTO.getEmail().equals(usuarioExistente.getEmail())) {
                if (usuarioServicio.existeUsuarioPorEmail(usuarioDTO.getEmail())) {
                    return ResponseEntity.badRequest().body(Map.of("error", "El email ya está registrado por otro usuario"));
                }
            }

            if (usuarioDTO.getNombre() != null) {
                usuarioExistente.setNombre(usuarioDTO.getNombre());
            }
            if (usuarioDTO.getEmail() != null) {
                usuarioExistente.setEmail(usuarioDTO.getEmail().toLowerCase());
            }
            if (usuarioDTO.getAvatarUrl() != null) {
                usuarioExistente.setAvatarUrl(usuarioDTO.getAvatarUrl());
            }
            if (usuarioDTO.getBiografia() != null) {
                usuarioExistente.setBiografia(usuarioDTO.getBiografia());
            }
            if (usuarioDTO.getUbicacion() != null) {
                usuarioExistente.setUbicacion(usuarioDTO.getUbicacion());
            }
            if (usuarioDTO.getFechaNacimiento() != null) {
                usuarioExistente.setFechaNacimiento(usuarioDTO.getFechaNacimiento());
            }
            
            if (usuarioDTO.getGenero() != null && !usuarioDTO.getGenero().trim().isEmpty()) {
                try {
                    usuarioExistente.setGenero(Usuario.Genero.valueOf(usuarioDTO.getGenero().toUpperCase()));
                } catch (IllegalArgumentException e) {
                    // Mantener el género actual si el nuevo no es válido
                }
            }
            
            if (usuarioDTO.getPeso() != null) {
                usuarioExistente.setPeso(BigDecimal.valueOf(usuarioDTO.getPeso()));
            }
            if (usuarioDTO.getAltura() != null) {
                usuarioExistente.setAltura(usuarioDTO.getAltura());
            }
            
            if (usuarioDTO.getContraseña() != null && !usuarioDTO.getContraseña().trim().isEmpty()) {
                usuarioExistente.setContraseña(usuarioDTO.getContraseña());
            }

            Usuario usuarioActualizado = usuarioServicio.actualizarUsuario(usuarioExistente);
            UsuarioDTO respuestaDTO = convertirAUsuarioDTO(usuarioActualizado);
            
            return ResponseEntity.ok(respuestaDTO);
            
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", "Error al actualizar usuario: " + e.getMessage()));
        }
    }

    @DeleteMapping("/usuarios/{id}")
    public ResponseEntity<?> eliminarUsuario(@PathVariable Long id) {
        try {
            Usuario usuario = usuarioServicio.obtenerUsuarioPorId(id)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado con ID: " + id));
            
            usuarioServicio.eliminarUsuario(id);
            
            return ResponseEntity.noContent().build();
            
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", "Error al eliminar usuario: " + e.getMessage()));
        }
    }

    @GetMapping("/desafios")
    public ResponseEntity<List<DesafioDTO>> obtenerTodosDesafios(Authentication authentication) {
        try {
            List<Desafio> desafios = desafioServicio.obtenerTodosDesafios();
            List<DesafioDTO> desafiosDTO = desafios.stream()
                    .map(this::convertirADesafioDTO)
                    .collect(Collectors.toList());
            return ResponseEntity.ok(desafiosDTO);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @PostMapping("/desafios")
    public ResponseEntity<?> crearDesafio(@RequestBody DesafioDTO desafioDTO, Authentication authentication) {
        try {
            if (desafioDTO.getTitulo() == null || desafioDTO.getTitulo().trim().isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("error", "El título es obligatorio"));
            }
            if (desafioDTO.getFecha_inicio() == null || desafioDTO.getFecha_fin() == null) {
                return ResponseEntity.badRequest().body(Map.of("error", "Las fechas de inicio y fin son obligatorias"));
            }
            if (desafioDTO.getFecha_inicio().isAfter(desafioDTO.getFecha_fin())) {
                return ResponseEntity.badRequest().body(Map.of("error", "La fecha de inicio no puede ser posterior a la fecha de fin"));
            }

            Desafio desafio = new Desafio();
            desafio.setTitulo(desafioDTO.getTitulo());
            desafio.setDescripcion(desafioDTO.getDescripcion());
            
            if (desafioDTO.getTipo_actividad() != null) {
                try {
                    desafio.setTipoActividad(Desafio.TipoActividad.valueOf(desafioDTO.getTipo_actividad().toUpperCase()));
                } catch (IllegalArgumentException e) {
                    return ResponseEntity.badRequest().body(Map.of("error", "Tipo de actividad no válido: " + desafioDTO.getTipo_actividad()));
                }
            }
            
            desafio.setObjetivo(desafioDTO.getObjetivo() != null ? BigDecimal.valueOf(desafioDTO.getObjetivo()) : null);
            desafio.setUnidadObjetivo(desafioDTO.getUnidad_objetivo());
            desafio.setFechaInicio(desafioDTO.getFecha_inicio());
            desafio.setFechaFin(desafioDTO.getFecha_fin());
            
            String adminEmail = authentication.getName();
            Usuario creador = usuarioServicio.obtenerUsuarioPorEmail(adminEmail)
                .orElseThrow(() -> new RuntimeException("Usuario admin no encontrado"));
            desafio.setCreador(creador);
            
            desafio.setEsPublico(desafioDTO.getEs_publico() != null ? desafioDTO.getEs_publico() : true);
            desafio.setIcono(desafioDTO.getIcono());
            
            if (desafioDTO.getDificultad() != null) {
                try {
                    desafio.setDificultad(Desafio.Dificultad.valueOf(desafioDTO.getDificultad().toUpperCase()));
                } catch (IllegalArgumentException e) {
                    return ResponseEntity.badRequest().body(Map.of("error", "Dificultad no válida: " + desafioDTO.getDificultad()));
                }
            }
            
            desafio.setMaxParticipantes(desafioDTO.getMax_participantes());
            desafio.setEstado(Desafio.Estado.ACTIVO);
            desafio.setFechaCreacion(LocalDateTime.now());
            desafio.setFechaActualizacion(LocalDateTime.now());

            Desafio desafioCreado = desafioServicio.crearDesafio(desafio);
            DesafioDTO respuestaDTO = convertirADesafioDTO(desafioCreado);
            
            return ResponseEntity.ok(respuestaDTO);
            
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", "Error al crear desafío: " + e.getMessage()));
        }
    }

    @PutMapping("/desafios/{id}")
    public ResponseEntity<?> actualizarDesafio(@PathVariable Long id, @RequestBody DesafioDTO desafioDTO) {
        try {
            Desafio desafioExistente = desafioServicio.obtenerDesafioPorId(id)
                .orElseThrow(() -> new RuntimeException("Desafío no encontrado con ID: " + id));
            
            if (desafioDTO.getFecha_inicio() != null && desafioDTO.getFecha_fin() != null) {
                if (desafioDTO.getFecha_inicio().isAfter(desafioDTO.getFecha_fin())) {
                    return ResponseEntity.badRequest().body(Map.of("error", "La fecha de inicio no puede ser posterior a la fecha de fin"));
                }
            }

            if (desafioDTO.getTitulo() != null) {
                desafioExistente.setTitulo(desafioDTO.getTitulo());
            }
            if (desafioDTO.getDescripcion() != null) {
                desafioExistente.setDescripcion(desafioDTO.getDescripcion());
            }
            if (desafioDTO.getTipo_actividad() != null) {
                try {
                    desafioExistente.setTipoActividad(Desafio.TipoActividad.valueOf(desafioDTO.getTipo_actividad().toUpperCase()));
                } catch (IllegalArgumentException e) {
                    return ResponseEntity.badRequest().body(Map.of("error", "Tipo de actividad no válido: " + desafioDTO.getTipo_actividad()));
                }
            }
            if (desafioDTO.getObjetivo() != null) {
                desafioExistente.setObjetivo(BigDecimal.valueOf(desafioDTO.getObjetivo()));
            }
            if (desafioDTO.getUnidad_objetivo() != null) {
                desafioExistente.setUnidadObjetivo(desafioDTO.getUnidad_objetivo());
            }
            if (desafioDTO.getFecha_inicio() != null) {
                desafioExistente.setFechaInicio(desafioDTO.getFecha_inicio());
            }
            if (desafioDTO.getFecha_fin() != null) {
                desafioExistente.setFechaFin(desafioDTO.getFecha_fin());
            }
            if (desafioDTO.getEs_publico() != null) {
                desafioExistente.setEsPublico(desafioDTO.getEs_publico());
            }
            if (desafioDTO.getIcono() != null) {
                desafioExistente.setIcono(desafioDTO.getIcono());
            }
            if (desafioDTO.getDificultad() != null) {
                try {
                    desafioExistente.setDificultad(Desafio.Dificultad.valueOf(desafioDTO.getDificultad().toUpperCase()));
                } catch (IllegalArgumentException e) {
                    return ResponseEntity.badRequest().body(Map.of("error", "Dificultad no válida: " + desafioDTO.getDificultad()));
                }
            }
            if (desafioDTO.getMax_participantes() != null) {
                desafioExistente.setMaxParticipantes(desafioDTO.getMax_participantes());
            }
            if (desafioDTO.getEstado() != null) {
                try {
                    desafioExistente.setEstado(Desafio.Estado.valueOf(desafioDTO.getEstado().toUpperCase()));
                } catch (IllegalArgumentException e) {
                    return ResponseEntity.badRequest().body(Map.of("error", "Estado no válido: " + desafioDTO.getEstado()));
                }
            }
            
            desafioExistente.setFechaActualizacion(LocalDateTime.now());

            Desafio desafioActualizado = desafioServicio.actualizarDesafio(desafioExistente);
            DesafioDTO respuestaDTO = convertirADesafioDTO(desafioActualizado);
            
            return ResponseEntity.ok(respuestaDTO);
            
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", "Error al actualizar desafío: " + e.getMessage()));
        }
    }

    @DeleteMapping("/desafios/{id}")
    public ResponseEntity<?> eliminarDesafio(@PathVariable Long id) {
        try {
            Desafio desafio = desafioServicio.obtenerDesafioPorId(id)
                .orElseThrow(() -> new RuntimeException("Desafío no encontrado con ID: " + id));
            
            desafioServicio.eliminarDesafio(id);
            
            return ResponseEntity.noContent().build();
            
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", "Error al eliminar desafío: " + e.getMessage()));
        }
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

    private DesafioDTO convertirADesafioDTO(Desafio desafio) {
        DesafioDTO dto = new DesafioDTO();
        dto.setId(desafio.getId());
        dto.setTitulo(desafio.getTitulo());
        dto.setDescripcion(desafio.getDescripcion());
        
        if (desafio.getTipoActividad() != null) {
            dto.setTipo_actividad(desafio.getTipoActividad().name().toLowerCase());
        }
        
        dto.setObjetivo(desafio.getObjetivo() != null ? desafio.getObjetivo().doubleValue() : null);
        dto.setUnidad_objetivo(desafio.getUnidadObjetivo());
        dto.setFecha_inicio(desafio.getFechaInicio());
        dto.setFecha_fin(desafio.getFechaFin());
        dto.setCreador_id(desafio.getCreador() != null ? desafio.getCreador().getId() : null);
        dto.setEs_publico(desafio.getEsPublico());
        dto.setIcono(desafio.getIcono());
        
        if (desafio.getDificultad() != null) {
            dto.setDificultad(desafio.getDificultad().name().toLowerCase());
        }
        
        dto.setMax_participantes(desafio.getMaxParticipantes());
        
        if (desafio.getEstado() != null) {
            dto.setEstado(desafio.getEstado().name().toLowerCase());
        }
        
        dto.setFecha_creacion(desafio.getFechaCreacion());
        dto.setFecha_actualizacion(desafio.getFechaActualizacion());
        
        return dto;
    }
}