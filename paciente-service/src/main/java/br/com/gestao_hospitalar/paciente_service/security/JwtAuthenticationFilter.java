package br.com.gestao_hospitalar.paciente_service.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.Collections;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

  @Autowired
  private JwtUtil jwtUtil;

  @Override
  protected void doFilterInternal(
    HttpServletRequest request,
    HttpServletResponse response,
    FilterChain filterChain
  ) throws ServletException, IOException {
    String header = request.getHeader("Authorization");
    if (header == null || !header.startsWith("Bearer ")) {
      response.sendError(
        HttpStatus.UNAUTHORIZED.value(),
        "Token JWT ausente ou inválido"
      );
      return;
    }
    String token = header.replace("Bearer ", "");
    try {
      Claims claims = jwtUtil.validateToken(token).getBody();
      String type = (String) claims.get("type");
      if (!"PACIENTE".equals(type)) {
        response.sendError(
          HttpStatus.FORBIDDEN.value(),
          "Acesso permitido apenas para PACIENTE"
        );
        return;
      }
      // Você pode adicionar mais dados do usuário no contexto se quiser
      UsernamePasswordAuthenticationToken authentication =
        new UsernamePasswordAuthenticationToken(
          claims.getSubject(),
          null,
          Collections.emptyList()
        );
      authentication.setDetails(
        new WebAuthenticationDetailsSource().buildDetails(request)
      );
      SecurityContextHolder.getContext().setAuthentication(authentication);
    } catch (JwtException | IllegalArgumentException e) {
      response.sendError(
        HttpStatus.UNAUTHORIZED.value(),
        "Token JWT inválido ou expirado"
      );
      return;
    }
    filterChain.doFilter(request, response);
  }
}
