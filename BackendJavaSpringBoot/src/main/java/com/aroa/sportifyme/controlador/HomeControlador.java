package com.aroa.sportifyme.controlador;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@RestController
public class HomeControlador {

    @GetMapping("/")
    public Map<String, Object> home() {
        Map<String, Object> response = new HashMap<>();
        response.put("aplicacion", "SportifyMe Backend");
        response.put("estado", "FUNCIONANDO CON MYSQL");
        response.put("fecha", LocalDateTime.now());
        response.put("version", "1.0.0");
        response.put("base_datos", "MySQL");
        response.put("endpoints", new String[] {
            "/api/test - Endpoint de prueba",
            "/api/health - Health check", 
            "/swagger-ui.html - Documentación API",
            "/api/auth/** - Autenticación"
        });
        return response;
    }
    
}