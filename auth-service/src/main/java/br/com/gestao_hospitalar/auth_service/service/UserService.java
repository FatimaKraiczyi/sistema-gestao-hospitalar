package br.com.gestao_hospitalar.auth_service.service;

import br.com.gestao_hospitalar.auth_service.dto.*;
import br.com.gestao_hospitalar.auth_service.entity.User;
import br.com.gestao_hospitalar.auth_service.enums.UserType;
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
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;

import java.util.Date;
import java.util.Random;
import java.util.UUID;

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

    // Adiciona o RestTemplate para comunicação entre serviços
    private final RestTemplate restTemplate = new RestTemplate();

    @Transactional // Garante que a operação seja atômica (ou tudo funciona, ou nada)
    public ApiResponse registerUser(RegisterRequest request) {
        if (repository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("E-mail já registrado");
        }
        if (repository.existsByCpf(request.getCpf())) {
            throw new RuntimeException("CPF já registrado");
        }

        String generatedPassword = generateRandomPassword(); 
        String hashedPassword = customPasswordEncoder.encodeWithSHA256(generatedPassword);

        User newUser = new User();

        // Gera um ID único para o novo usuário
        newUser.setId(UUID.randomUUID());
        newUser.setCpf(request.getCpf());
        newUser.setEmail(request.getEmail());
        // Define o tipo de usuário como PACIENTE, que é o correto para esta rota
        newUser.setType(UserType.PACIENTE);
        newUser.setPassword(hashedPassword);

        // 1. Salva o usuário no banco de dados do auth-service
        repository.save(newUser);

        // 2. Prepara a chamada para o paciente-service
        try {
            String pacienteServiceUrl = "http://paciente-service:8082/paciente";
            // Cria o objeto com os dados para o paciente-service
            PacienteRequestDTO pacienteRequest = new PacienteRequestDTO();
            pacienteRequest.setId(newUser.getId()); // Usa o mesmo ID
            pacienteRequest.setCpf(request.getCpf());
            pacienteRequest.setEmail(request.getEmail());
            pacienteRequest.setNome(request.getName());
            pacienteRequest.setCep(request.getCep());
            pacienteRequest.setNumero(request.getNumero());
            pacienteRequest.setComplemento(request.getComplemento());

            // 3. Chama o paciente-service para criar o paciente
            restTemplate.postForObject(pacienteServiceUrl, pacienteRequest, String.class);

        } catch (Exception e) {
            // Se a chamada para o paciente-service falhar, desfaz o cadastro do usuário
            throw new RuntimeException("Falha ao criar registro do paciente. Cadastro não concluído.", e);
        }

        // 4. Envia a senha por e-mail apenas se tudo deu certo
        sendPasswordByEmail(newUser.getEmail(), generatedPassword);

        return new ApiResponse("Usuário registrado com sucesso. Senha enviada para o e-mail: " + newUser.getEmail());
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
				    .setSubject(user.getId().toString())
            .claim("uuid", user.getId().toString())
						.claim("email", user.getEmail())
            .claim("cpf", user.getCpf())
            .claim("type", user.getType().name())
            .setIssuedAt(new Date())
            .setExpiration(new Date(System.currentTimeMillis() + 86400000)) // 24h
            .signWith(SignatureAlgorithm.HS256, jwtSecret)
            .compact();
    }
}