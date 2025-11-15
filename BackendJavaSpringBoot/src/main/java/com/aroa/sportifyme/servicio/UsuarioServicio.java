package com.aroa.sportifyme.servicio;

import com.aroa.sportifyme.exception.*;
import com.aroa.sportifyme.modelo.*;
import com.aroa.sportifyme.repository.*;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.*;

@Service
@RequiredArgsConstructor
public class UsuarioServicio implements UserDetailsService {

    private final UsuarioRepository usuarioRepository;
    private final RolRepository rolRepository; 
    private final PasswordEncoder passwordEncoder;
    private static final Logger logger = LoggerFactory.getLogger(UsuarioServicio.class);

    @Override
    @Transactional(readOnly = true)
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        Usuario usuario = buscarPorEmail(email)
                .orElseThrow(() -> new UsuarioNoEncontradoException(email));

        String rolNombre = usuario.getRol() != null ? usuario.getRol().getNombre() : "USUARIO";

        List<GrantedAuthority> authorities = Collections.singletonList(
                new SimpleGrantedAuthority("ROLE_" + rolNombre));

        return User.builder()
                .username(usuario.getEmail())
                .password(usuario.getContraseña())
                .authorities(authorities)
                .build();
    }

    // ==================== MÉTODOS PARA EL ADMIN CONTROLLER ====================

    @Transactional(readOnly = true)
    public Optional<Usuario> obtenerUsuarioPorId(Long id) {
        return usuarioRepository.findById(id);
    }

    @Transactional(readOnly = true)
    public Optional<Usuario> obtenerUsuarioPorEmail(String email) {
        return usuarioRepository.findByEmail(email);
    }

    @Transactional(readOnly = true)
    public boolean existeUsuarioPorEmail(String email) {
        return usuarioRepository.existsByEmail(email);
    }

    @Transactional
    public Usuario actualizarUsuario(Usuario usuario) {
        logger.info(" Actualizando usuario ID: {}", usuario.getId());
        
        if (!usuarioRepository.existsById(usuario.getId())) {
            throw new UsuarioNoEncontradoException("Usuario con ID " + usuario.getId() + " no encontrado");
        }

        if (usuario.getEmail() != null) {
            Optional<Usuario> usuarioConEmail = usuarioRepository.findByEmail(usuario.getEmail());
            if (usuarioConEmail.isPresent() && !usuarioConEmail.get().getId().equals(usuario.getId())) {
                throw new EmailYaRegistradoException(usuario.getEmail());
            }
        }

        if (usuario.getContraseña() != null && !usuario.getContraseña().startsWith("$2a$")) {
            usuario.setContraseña(passwordEncoder.encode(usuario.getContraseña()));
            logger.info("Contraseña codificada para usuario ID: {}", usuario.getId());
        }

        if (usuario.getRol() != null && usuario.getRol().getId() != null) {
            Rol rolPersistido = rolRepository.findById(usuario.getRol().getId())
                .orElseThrow(() -> new RuntimeException("Rol no encontrado con ID: " + usuario.getRol().getId()));
            usuario.setRol(rolPersistido);
            logger.info("Rol asignado: {}", rolPersistido.getNombre());
        }

        validarUsuarioParaActualizacion(usuario);
        Usuario usuarioActualizado = usuarioRepository.save(usuario);
        usuarioRepository.flush();
        
        logger.info("✅ Usuario actualizado exitosamente ID: {}", usuarioActualizado.getId());
        return usuarioActualizado;
    }

    @Transactional
    public void eliminarUsuario(Long id) {
        logger.info(" Eliminando usuario ID: {}", id);
        
        if (!usuarioRepository.existsById(id)) {
            throw new UsuarioNoEncontradoException("Usuario con ID " + id + " no encontrado");
        }
        usuarioRepository.deleteById(id);
        usuarioRepository.flush(); 
        
        logger.info("Usuario eliminado exitosamente ID: {}", id);
    }

    // ==================== MÉTODOS EXISTENTES ====================

    public boolean verificarPassword(String email, String passwordPlana) {
        Optional<Usuario> usuarioOpt = buscarPorEmail(email);
        if (usuarioOpt.isEmpty()) {
            return false;
        }
        Usuario usuario = usuarioOpt.get();
        return passwordEncoder.matches(passwordPlana, usuario.getContraseña());
    }

    @Transactional
    public Usuario registrarUsuario(Usuario usuario) {
        logger.info("🔄 Registrando nuevo usuario: {}", usuario.getEmail());
        
        if (existePorEmail(usuario.getEmail())) {
            throw new EmailYaRegistradoException(usuario.getEmail());
        }

        validarUsuario(usuario);
        
        // ✅ Codificar contraseña
        usuario.setContraseña(passwordEncoder.encode(usuario.getContraseña()));
        logger.info("🔐 Contraseña codificada");

        // ✅ VERIFICAR Y ASIGNAR ROL DESDE LA BASE DE DATOS
        if (usuario.getRol() == null || usuario.getRol().getId() == null) {
            // Asignar rol por defecto (USUARIO)
            Rol rolPorDefecto = rolRepository.findById(2L)
                .orElseThrow(() -> new RuntimeException("Rol por defecto (ID: 2) no encontrado"));
            usuario.setRol(rolPorDefecto);
            logger.info("👤 Rol por defecto asignado: {}", rolPorDefecto.getNombre());
        } else {
            
            Rol rolPersistido = rolRepository.findById(usuario.getRol().getId())
                .orElseThrow(() -> new RuntimeException("Rol no encontrado con ID: " + usuario.getRol().getId()));
            usuario.setRol(rolPersistido);
            logger.info("👤 Rol específico asignado: {}", rolPersistido.getNombre());
        }

        Usuario usuarioGuardado = usuarioRepository.save(usuario);
        usuarioRepository.flush(); 
        
        logger.info("Usuario registrado exitosamente ID: {}", usuarioGuardado.getId());
        return usuarioGuardado;
    }

    @Transactional(readOnly = true)
    public Optional<Usuario> buscarPorId(Long id) {
        return usuarioRepository.findById(id);
    }

    @Transactional(readOnly = true)
    public boolean existePorId(Long id) {
        return usuarioRepository.existsById(id);
    }

    @Transactional(readOnly = true)
    public Optional<Usuario> buscarPorEmail(String email) {
        return usuarioRepository.findByEmail(email);
    }

    @Transactional(readOnly = true)
    public boolean existePorEmail(String email) {
        return usuarioRepository.existsByEmail(email);
    }

    @Transactional(readOnly = true)
    public List<Usuario> obtenerTodosUsuarios() {
        return usuarioRepository.findAll();
    }

    // ==================== MÉTODOS DE VALIDACIÓN ====================

    private void validarUsuario(Usuario usuario) {
        if (usuario.getEmail() == null || usuario.getEmail().trim().isEmpty()) {
            throw new IllegalArgumentException("El email es obligatorio");
        }
        if (!usuario.getEmail().matches("^[\\w-.]+@([\\w-]+\\.)+[\\w-]{2,4}$")) {
            throw new IllegalArgumentException("Formato de email inválido");
        }
        if (usuario.getContraseña() == null || usuario.getContraseña().trim().isEmpty()) {
            throw new IllegalArgumentException("La contraseña es obligatoria");
        }
        if (usuario.getContraseña().length() < 6) {
            throw new IllegalArgumentException("La contraseña debe tener al menos 6 caracteres");
        }
        if (usuario.getNombre() == null || usuario.getNombre().trim().isEmpty()) {
            throw new IllegalArgumentException("El nombre es obligatorio");
        }
    }

    private void validarUsuarioParaActualizacion(Usuario usuario) {
        if (usuario.getEmail() == null || usuario.getEmail().trim().isEmpty()) {
            throw new IllegalArgumentException("El email es obligatorio");
        }
        if (!usuario.getEmail().matches("^[\\w-.]+@([\\w-]+\\.)+[\\w-]{2,4}$")) {
            throw new IllegalArgumentException("Formato de email inválido");
        }
        if (usuario.getNombre() == null || usuario.getNombre().trim().isEmpty()) {
            throw new IllegalArgumentException("El nombre es obligatorio");
        }
    }
}