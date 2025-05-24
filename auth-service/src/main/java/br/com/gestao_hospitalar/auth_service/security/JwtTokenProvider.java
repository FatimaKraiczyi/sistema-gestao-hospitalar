package br.com.gestao_hospitalar.auth_service.security;

import br.com.gestao_hospitalar.auth_service.entity.User;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import java.util.Date;
import java.util.UUID;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
public class JwtTokenProvider {

  @Value("${jwt.secret}")
  private String jwtSecret;

  @Value("${jwt.expiration}")
  private long jwtExpirationInMs;

  public String generateToken(User user) {
    return Jwts.builder()
      .setSubject(user.getId().toString())
      .claim("email", user.getEmail())
      .claim("cpf", user.getCpf())
      .claim("type", user.getType().name())
      .setIssuedAt(new Date())
      .setExpiration(new Date(System.currentTimeMillis() + jwtExpirationInMs))
      .signWith(SignatureAlgorithm.HS256, jwtSecret)
      .compact();
  }
}
