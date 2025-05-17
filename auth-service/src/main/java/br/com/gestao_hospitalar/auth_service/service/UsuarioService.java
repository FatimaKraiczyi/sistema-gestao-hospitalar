package br.com.gestao_hospitalar.auth_service.service;

import br.com.gestao_hospitalar.auth_service.dto.AuthRequest;
import br.com.gestao_hospitalar.auth_service.dto.AuthResponse;
import br.com.gestao_hospitalar.auth_service.dto.RegisterRequest;
import br.com.gestao_hospitalar.auth_service.entity.Usuario;
import br.com.gestao_hospitalar.auth_service.repository.UsuarioRepository;
import br.com.gestao_hospitalar.auth_service.security.CustomPasswordEncoder;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import org.springframework.beans.factory.annotation.*;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
@RequiredArgsConstructor
public class UsuarioService {

    @Autowired private UsuarioRepository repository;
    @Autowired private CustomPasswordEncoder customPasswordEncoder;
    @Autowired private JavaMailSender mailSender;

    @Value("${jwt.secret}")
    private String jwtSecret;

 public RegisterResponse registrar(RegisterRequest request) {
    if (repository.existsByEmail(request.getEmail())) {
        throw new RuntimeException("E-mail já registrado");
    }
    if (repository.existsByCpf(request.getCpf())) {
        throw new RuntimeException("CPF já registrado");
    }

    String senha = gerarSenhaNumerica();
    String senhaCriptografada = customPasswordEncoder.encodeWithSHA256(senha);

    Usuario user = Usuario.builder()
            .cpf(request.getCpf())
            .email(request.getEmail())
            .tipo(request.getTipo())
            .senha(senhaCriptografada)
            .build();

    Usuario savedUser = repository.save(user);

    enviarSenhaPorEmail(savedUser.getEmail(), senha);

    return new RegisterResponse(
        savedUser.getEmail(),
        "Usuário registrado com sucesso. Verifique o e-mail para acessar.",
        LocalDateTime.now(),
    );
}

    public AuthResponse authenticate(AuthRequest request) {
        Usuario user = repository.findByEmail(request.getEmail())
            .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

        if (!customPasswordEncoder.matches(request.getSenha(), user.getSenha())) {
            throw new RuntimeException("Senha inválida");
        }

        return gerarToken(user);
    }

    private String gerarToken(Usuario usuario) {
    return Jwts.builder()
        .setSubject(usuario.getEmail())
        .claim("cpf", usuario.getCpf())
        .claim("tipo", usuario.getTipo().toString())
        .setIssuedAt(new Date())
        .setExpiration(new Date(System.currentTimeMillis() + 86400000)) // expira em 1 dia
        .signWith(SignatureAlgorithm.HS256, jwtSecret.getBytes())
        .compact();
}

    private String gerarSenhaNumerica() {
        return String.format("%04d", new Random().nextInt(10000));
    }

    private void enviarSenhaPorEmail(String para, String senha) {
    SimpleMailMessage msg = new SimpleMailMessage();
    msg.setTo(para);
    msg.setSubject("Senha de acesso ao sistema");
    msg.setText("""
            Bem-vindo ao Sistema de Gestão Hospitalar!

            Sua senha de acesso é: %s

            Equipe TI Hospitalar
            """.formatted(senha)
    );
    mailSender.send(msg);
}

}