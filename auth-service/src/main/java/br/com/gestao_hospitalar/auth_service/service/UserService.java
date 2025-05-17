package br.com.gestao_hospitalar.auth_service.service;

import br.com.gestao_hospitalar.auth_service.dto.UserRegisterDTO;
import br.com.gestao_hospitalar.auth_service.dto.AuthRequest;
import br.com.gestao_hospitalar.auth_service.dto.AuthResponse;
import br.com.gestao_hospitalar.auth_service.dto.ForgotEmailRequest;
import br.com.gestao_hospitalar.auth_service.dto.ForgotPasswordRequest;
import br.com.gestao_hospitalar.auth_service.dto.ApiResponse;
import br.com.gestao_hospitalar.auth_service.entity.User;
import br.com.gestao_hospitalar.auth_service.repository.UserRepository;
import br.com.gestao_hospitalar.auth_service.security.CustomPasswordEncoder;
import io.jsonwebtoken.Jwts;
import org.springframework.beans.factory.annotation.Autowired;
import io.jsonwebtoken.SignatureAlgorithm;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.Random;

@Service
public class UserService {

    @Autowired
    private UserRepository repository;

		@Autowired
    private CustomPasswordEncoder customPasswordEncoder;

		@Autowired
    private JavaMailSender mailSender;

    @Value("${jwt.secret}")
    private String jwtSecret;
   
    public void registerUser(UserRegisterDTO dto) throws Exception {
        if (repository.existsByEmail(dto.getEmail())) {
            throw new Exception("E-mail já registrado");
        }
        if (repository.existsByCpf(dto.getCpf())) {
            throw new Exception("CPF já registrado");
        }

				String generatedPassword = generateRandomPassword();
        String hashedPassword = customPasswordEncoder.encodeWithSHA256(generatedPassword);

        User newUser = new User();
        newUser.setCpf(dto.getCpf());
        newUser.setEmail(dto.getEmail());
        newUser.setType(dto.getType());
				newUser.setPassword(hashedPassword);

        // Salva no banco
        repository.save(newUser);

        // Envia senha por e-mail
        sendPasswordByEmail(newUser.getEmail(), generatedPassword);
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