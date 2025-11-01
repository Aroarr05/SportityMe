package com.aroa.sportifyme.seguridad.jwt;

import com.aroa.sportifyme.servicio.UsuarioServicio;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import java.io.IOException;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    @Autowired
    private JwtTokenProvider jwtTokenProvider;
    
    @Autowired
    private UsuarioServicio usuarioServicio;

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain) throws ServletException, IOException {

        String requestPath = request.getRequestURI();
        String method = request.getMethod();

        System.out.println("\n🔐 JWT Filter - " + method + " " + requestPath);

        try {
            String token = obtenerTokenDeRequest(request);

            if (token != null && !token.isEmpty()) {
                System.out.println("🔐 Token encontrado, validando...");
                
                if (jwtTokenProvider.validarToken(token)) {
                    String username = jwtTokenProvider.obtenerUsernameDeToken(token);
                    
                    if (username != null && !username.isEmpty()) {
                        System.out.println("🔐 Cargando usuario: " + username);
                        
                        try {
                            UserDetails userDetails = usuarioServicio.loadUserByUsername(username);
                            
                            if (userDetails != null) {
                                System.out.println("🔐 UserDetails cargado, authorities: " + userDetails.getAuthorities());
                                
                                UsernamePasswordAuthenticationToken authentication = 
                                    new UsernamePasswordAuthenticationToken(
                                        userDetails, 
                                        null, 
                                        userDetails.getAuthorities()
                                    );

                                SecurityContextHolder.getContext().setAuthentication(authentication);
                                System.out.println("✅ Autenticación establecida para: " + username);
                            } else {
                                System.out.println("❌ UserDetails es null");
                                SecurityContextHolder.clearContext();
                            }
                        } catch (UsernameNotFoundException e) {
                            System.out.println("❌ Usuario no encontrado: " + username);
                            SecurityContextHolder.clearContext();
                        }
                    } else {
                        System.out.println("❌ Username es null o vacío");
                        SecurityContextHolder.clearContext();
                    }
                } else {
                    System.out.println("❌ Token inválido");
                    SecurityContextHolder.clearContext();
                }
            } else {
                System.out.println("🔐 Sin token en la request");
                SecurityContextHolder.clearContext();
            }
        } catch (Exception ex) {
            System.out.println("❌ Error en JWT Filter: " + ex.getMessage());
            ex.printStackTrace();
            SecurityContextHolder.clearContext();
        }

        filterChain.doFilter(request, response);
    }

    private String obtenerTokenDeRequest(HttpServletRequest request) {
        String bearerToken = request.getHeader("Authorization");
        
        if (bearerToken != null && bearerToken.startsWith("Bearer ")) {
            String token = bearerToken.substring(7);
            System.out.println("🔐 Token extraído: " + (token.length() > 50 ? token.substring(0, 50) + "..." : token));
            return token;
        }
        
        System.out.println("🔐 No se encontró Authorization header con Bearer");
        return null;
    }
}