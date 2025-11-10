package com.aroa.sportifyme.controlador;

import com.aroa.sportifyme.modelo.Progreso;
import com.aroa.sportifyme.seguridad.dto.ProgresoDTO;
import com.aroa.sportifyme.seguridad.jwt.JwtTokenProvider;
import com.aroa.sportifyme.servicio.ProgresoServicio;
import com.aroa.sportifyme.servicio.UsuarioServicio;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/progresos")
@RequiredArgsConstructor
public class ProgresoController {

    private final ProgresoServicio progresoServicio;
    private final UsuarioServicio usuarioServicio;
    private final JwtTokenProvider jwtTokenProvider;

    @GetMapping("/usuario")
    public ResponseEntity<List<ProgresoDTO>> obtenerProgresosDelUsuario(
            @RequestHeader("Authorization") String authorizationHeader) {
        
        try {
            String token = authorizationHeader.replace("Bearer ", "");
            
            if (!jwtTokenProvider.validarToken(token)) {
                return ResponseEntity.status(403).build();
            }
            
            String username = jwtTokenProvider.obtenerUsernameDeToken(token);
            
            var usuarioOpt = usuarioServicio.buscarPorEmail(username);
            if (usuarioOpt.isEmpty()) {
                return ResponseEntity.status(404).build();
            }
            
            var usuario = usuarioOpt.get();
            
            List<Progreso> progresos = progresoServicio.obtenerProgresosPorUsuario(usuario.getId());
            
            List<ProgresoDTO> progresosDTO = progresos.stream()
                    .map(ProgresoDTO::fromEntity)
                    .collect(Collectors.toList());
            
            return ResponseEntity.ok(progresosDTO);
            
        } catch (Exception e) {
            return ResponseEntity.status(500).build();
        }
    }
}