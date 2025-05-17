package br.com.gestao_hospitalar.auth_service.service;

import br.com.gestao_hospitalar.auth_service.dto.*;
import br.com.gestao_hospitalar.auth_service.entity.User;
import br.com.gestao_hospitalar.auth_service.repository.UserRepository;
import br.com.gestao_hospitalar.auth_service.security.CustomPasswordEncoder;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.Random;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository repository;
    private final CustomPasswordEncoder customPasswordEncoder;
    private final JavaMailSender mailSender;

    @Value("${jwt.secret}")
    private String jwtSecret;

    public ApiResponse registerUser(RegisterRequest request) {
    // Verificações de unicidade
    if (repository.existsByEmail(request.getEmail())) {
        throw new RuntimeException("E-mail já registrado");
    }
    if (repository.existsByCpf(request.getCpf())) {
        throw new RuntimeException("CPF já registrado");
    }

    // Gera senha aleatória de 4 dígitos
    String generatedPassword = generateRandomPassword(); // ex: "8371"

    // Criptografa com SHA-256 + salt
    String hashedPassword = customPasswordEncoder.encodeWithSHA256(generatedPassword);

    // Cria novo usuário
    User user = new User(
        request.getCpf(),
        request.getEmail(),
        hashedPassword,
        request.getType()
    );

    // Salva no banco
    repository.save(user);

    // Envia senha por e-mail
    sendPasswordByEmail(user.getEmail(), generatedPassword);

    // Retorna resposta padronizada
    return new ApiResponse("Usuário registrado com sucesso. Senha enviada para o e-mail: " + user.getEmail());
}

    public AuthResponse authenticate(AuthRequest request) {
        User user = repository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

        if (!customPasswordEncoder.matches(request.getPassword(), user.getPassword())) {
  						throw new RuntimeException("Senha inválida");
}

        return new AuthResponse(generateToken(user));
    }

    public ApiResponse handleForgotPassword(ForgotPasswordRequest request) {
        User user = repository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("E-mail não encontrado"));

        String newPassword = generateRandomPassword();
        String hashedPassword = customPasswordEncoder.encodeWithSHA256(newPassword);

        user.setPassword(hashedPassword);
        repository.save(user);

        sendPasswordByEmail(user.getEmail(), newPassword);

        return new ApiResponse("Nova senha enviada para o e-mail: " + user.getEmail());
    }

    public ApiResponse handleForgotEmail(ForgotEmailRequest request) {
        User user = repository.findByCpf(request.getCpf())
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
        message.setText(String.format("""
                Bem-vindo ao Sistema de Gestão Hospitalar!

                Sua senha de acesso é: %s

                Equipe TI Hospitalar
                """, password)
        );
        mailSender.send(message);
    }

    private String generateToken(User user) {
        return Jwts.builder()
                .setSubject(user.getEmail())
                .claim("cpf", user.getCpf())
                .claim("type", user.getType().name())
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + 86400000)) // 24h
                .signWith(SignatureAlgorithm.HS256, jwtSecret)
                .compact();
    }
}