package br.com.gestao_hospitalar.auth_service.service;

import br.com.gestao_hospitalar.auth_service.dto.*;
import br.com.gestao_hospitalar.auth_service.entity.User;
import br.com.gestao_hospitalar.auth_service.repository.UserRepository;
import br.com.gestao_hospitalar.auth_service.security.CustomPasswordEncoder;
import br.com.gestao_hospitalar.auth_service.security.JwtTokenProvider;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import java.util.Date;
import java.util.Random;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class UserService {

  @Autowired
  private UserRepository repository;

  @Autowired
  private CustomPasswordEncoder customPasswordEncoder;

  @Autowired
  private JavaMailSender mailSender;

  @Autowired
  private JwtTokenProvider jwtTokenProvider;

  public ApiResponse registerUser(RegisterRequest request) {
    if (repository.existsByEmail(request.getEmail())) {
      throw new RuntimeException("E-mail já registrado");
    }
    if (repository.existsByCpf(request.getCpf())) {
      throw new RuntimeException("CPF já registrado");
    }

    String generatedPassword = generateRandomPassword();
    String hashedPassword = customPasswordEncoder.encodeWithSHA256(
      generatedPassword
    );

    User newUser = new User();
    newUser.setCpf(request.getCpf());
    newUser.setEmail(request.getEmail());
    newUser.setType(request.getType());
    newUser.setPassword(hashedPassword);

    // Salva no banco
    repository.save(newUser);

    sendPasswordByEmail(newUser.getEmail(), generatedPassword);

    return new ApiResponse(
      "Usuário registrado com sucesso. Senha enviada para o e-mail: " +
      newUser.getEmail()
    );
  }

  public AuthResponse authenticate(AuthRequest request) {
    User user = repository
      .findByEmail(request.getEmail())
      .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

    if (
      !customPasswordEncoder.matches(request.getPassword(), user.getPassword())
    ) {
      throw new RuntimeException("Senha inválida");
    }

    return new AuthResponse(jwtTokenProvider.generateToken(user));
  }

  public ApiResponse handleForgotPassword(ForgotPasswordRequest request) {
    User user = repository
      .findByEmail(request.getEmail())
      .orElseThrow(() -> new RuntimeException("E-mail não encontrado"));

    String newPassword = generateRandomPassword();
    String hashedPassword = customPasswordEncoder.encodeWithSHA256(newPassword);

    user.setPassword(hashedPassword);
    repository.save(user);

    sendPasswordByEmail(user.getEmail(), newPassword);

    return new ApiResponse(
      "Nova senha enviada para o e-mail: " + user.getEmail()
    );
  }

  public ApiResponse handleForgotEmail(ForgotEmailRequest request) {
    User user = repository
      .findByCpf(request.getCpf())
      .orElseThrow(() -> new RuntimeException("CPF não encontrado"));

    return new ApiResponse("Seu email cadastrado é: " + user.getEmail());
  }

  private String generateRandomPassword() {
    return String.format("%04d", new Random().nextInt(10000));
  }

  private void sendPasswordByEmail(String to, String password) {
    SimpleMailMessage message = new SimpleMailMessage();
    message.setTo(to);
    message.setSubject("Senha de acesso");
    message.setText(
      String.format(
        """
        Bem-vindo ao Sistema de Gestão Hospitalar!

        Sua senha de acesso é: %s

        Equipe TI Hospitalar
        """,
        password
      )
    );
    mailSender.send(message);
  }
}
