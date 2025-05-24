package br.com.gestao_hospitalar.paciente_service.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

@Component
public class JwtFilter extends OncePerRequestFilter {

  private String JWT_SECRET;

  @Value("${jwt.secret}")
  private final String jwtSecret = JWT_SECRET;

  @Override
  protected void doFilterInternal(
    HttpServletRequest request,
    HttpServletResponse response,
    FilterChain filterChain
  ) throws ServletException, IOException {
    String authHeader = request.getHeader("Authorization");

    if (authHeader == null || !authHeader.startsWith("Bearer ")) {
      response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
      response.getWriter().write("Missing or invalid Authorization header");
      return;
    }

    String token = authHeader.substring(7);

    try {
      Claims claims = Jwts.parser()
        .setSigningKey(jwtSecret)
        .parseClaimsJws(token)
        .getBody();

      request.setAttribute("userId", claims.getSubject());
      request.setAttribute("cpf", claims.get("cpf"));
      request.setAttribute("email", claims.get("email"));
      request.setAttribute("type", claims.get("type"));
    } catch (Exception e) {
      response.setStatus(HttpServletResponse.SC_FORBIDDEN);
      response.getWriter().write("Invalid or expired token");
      return;
    }

    filterChain.doFilter(request, response);
  }
}
