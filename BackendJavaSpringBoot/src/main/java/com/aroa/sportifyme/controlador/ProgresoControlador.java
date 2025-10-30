package com.aroa.sportifyme.controlador;

import com.aroa.sportifyme.modelo.Progreso;
import com.aroa.sportifyme.seguridad.jwt.JwtTokenProvider;
import com.aroa.sportifyme.servicio.ProgresoServicio;
import com.aroa.sportifyme.servicio.UsuarioServicio;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/progresos")
@RequiredArgsConstructor
public class ProgresoControlador {

    private final ProgresoServicio progresoServicio;
    private final UsuarioServicio usuarioServicio;
    private final JwtTokenProvider jwtTokenProvider;

    @GetMapping("/usuario")
    public ResponseEntity<List<Progreso>> obtenerProgresosDelUsuario(
            @RequestHeader("Authorization") String authorizationHeader) {
        
        try {
            System.out.println("🔍 Endpoint /api/progresos/usuario llamado");
            
            // Extraer token
            String token = authorizationHeader.replace("Bearer ", "");
            System.out.println("🔑 Token recibido: " + (token.length() > 20 ? token.substring(0, 20) + "..." : token));
            
            // Validar token
            if (!jwtTokenProvider.validarToken(token)) {
                System.out.println("❌ Token inválido");
                return ResponseEntity.status(403).build();
            }
            
            // Obtener username del token
            String username = jwtTokenProvider.obtenerUsernameDeToken(token);
            System.out.println("👤 Usuario del token: " + username);
            
            // Buscar usuario por email
            var usuarioOpt = usuarioServicio.buscarPorEmail(username);
            if (usuarioOpt.isEmpty()) {
                System.out.println("❌ Usuario no encontrado: " + username);
                return ResponseEntity.status(404).build();
            }
            
            var usuario = usuarioOpt.get();
            System.out.println("✅ Usuario encontrado: " + usuario.getNombre() + " (ID: " + usuario.getId() + ")");
            
            // Obtener progresos
            List<Progreso> progresos = progresoServicio.obtenerProgresosPorUsuario(usuario.getId());
            System.out.println("📊 Progresos encontrados: " + progresos.size());
            
            return ResponseEntity.ok(progresos);
            
        } catch (Exception e) {
            System.err.println("💥 Error en obtenerProgresosDelUsuario: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(500).build();
        }
    }
}