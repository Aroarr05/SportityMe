package com.aroa.sportifyme.seguridad.jwt;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import io.jsonwebtoken.security.SignatureException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;
import java.security.Key;
import java.util.Date;

@Component
public class JwtTokenProvider {

    @Value("${app.jwt-secret:miClaveSecretaMuyLargaParaJWT256BitsDeSeguridad}")
    private String jwtSecret;

    @Value("${app.jwt-expiration-ms:86400000}")
    private int jwtExpirationMs;

    private Key getSigningKey() {
        // Asegurar que la clave tenga al menos 256 bits (32 bytes)
        byte[] keyBytes = jwtSecret.getBytes();
        if (keyBytes.length < 32) {
            byte[] paddedKey = new byte[32];
            System.arraycopy(keyBytes, 0, paddedKey, 0, keyBytes.length);
            return Keys.hmacShaKeyFor(paddedKey);
        }
        return Keys.hmacShaKeyFor(keyBytes);
    }

    public String generarToken(Authentication authentication) {
        String username = authentication.getName();
        Date ahora = new Date();
        Date expiracion = new Date(ahora.getTime() + jwtExpirationMs);

        System.out.println("🔐 Generando token para: " + username);

        return Jwts.builder()
                .setSubject(username)
                .setIssuedAt(ahora)
                .setExpiration(expiracion)
                .signWith(getSigningKey(), SignatureAlgorithm.HS512)
                .compact();
    }

    public String obtenerUsernameDeToken(String token) {
        try {
            Claims claims = Jwts.parserBuilder()
                    .setSigningKey(getSigningKey())
                    .build()
                    .parseClaimsJws(token)
                    .getBody();
            
            String username = claims.getSubject();
            System.out.println("🔐 Username extraído: " + username);
            return username;
            
        } catch (Exception e) {
            System.out.println("❌ Error extrayendo username: " + e.getMessage());
            return null;
        }
    }

    public boolean validarToken(String token) {
        try {
            System.out.println("🔐 Validando token...");
            
            Jwts.parserBuilder()
                    .setSigningKey(getSigningKey())
                    .build()
                    .parseClaimsJws(token);
            
            System.out.println("✅ Token válido");
            return true;
            
        } catch (SignatureException ex) {
            System.out.println("❌ Firma JWT inválida");
        } catch (MalformedJwtException ex) {
            System.out.println("❌ Token JWT mal formado");
        } catch (ExpiredJwtException ex) {
            System.out.println("❌ Token JWT expirado");
        } catch (UnsupportedJwtException ex) {
            System.out.println("❌ Token JWT no soportado");
        } catch (IllegalArgumentException ex) {
            System.out.println("❌ Claims JWT vacíos");
        } catch (Exception ex) {
            System.out.println("❌ Error validando token: " + ex.getMessage());
        }
        return false;
    }
}