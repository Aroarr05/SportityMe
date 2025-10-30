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

        try {
            String token = obtenerTokenDeRequest(request);

            if (token != null && jwtTokenProvider.validarToken(token)) {
                String username = jwtTokenProvider.obtenerUsernameDeToken(token);
                
                System.out.println("JWT Filter - Cargando usuario: " + username);
                
                UserDetails userDetails = usuarioServicio.loadUserByUsername(username);
                
                System.out.println("JWT Filter - Authorities cargadas: " + userDetails.getAuthorities());
                
                var authentication = new UsernamePasswordAuthenticationToken(
                        userDetails, null, userDetails.getAuthorities());

                SecurityContextHolder.getContext().setAuthentication(authentication);
                
                System.out.println("JWT Filter - Autenticación establecida para: " + username);
            }
        } catch (Exception ex) {
            logger.error("Error en la autenticación JWT", ex);
            System.out.println("JWT Filter - Error: " + ex.getMessage());
        }

        filterChain.doFilter(request, response);
    }

    private String obtenerTokenDeRequest(HttpServletRequest request) {
        String bearerToken = request.getHeader("Authorization");
        if (bearerToken != null && bearerToken.startsWith("Bearer ")) {
            return bearerToken.substring(7);
        }
        return null;
    }
}