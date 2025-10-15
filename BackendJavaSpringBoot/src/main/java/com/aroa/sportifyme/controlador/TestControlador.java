package com.aroa.sportifyme.controlador;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class TestControlador {

    @GetMapping("/test")
    public Map<String, Object> test() {
        Map<String, Object> response = new HashMap<>();
        response.put("mensaje", "SportifyMe API está funcionando correctamente con MySQL");
        response.put("fecha", LocalDateTime.now());
        response.put("estado", "ACTIVO");
        response.put("base_datos", "MySQL");
        response.put("version", "1.0.0");
        return response;
    }

    @GetMapping("/health")
    public Map<String, String> health() {
        Map<String, String> response = new HashMap<>();
        response.put("status", "UP");
        response.put("database", "MySQL");
        response.put("timestamp", LocalDateTime.now().toString());
        return response;
    }
}