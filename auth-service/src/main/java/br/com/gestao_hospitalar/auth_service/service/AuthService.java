package br.com.gestao_hospitalar.auth_service.service;

import br.com.gestao_hospitalar.auth_service.dto.*;
import br.com.gestao_hospitalar.auth_service.entity.*;
import br.com.gestao_hospitalar.auth_service.enums.*;
import br.com.gestao_hospitalar.auth_service.repository.UsuarioRepository;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.security.SecureRandom;
import java.time.Instant;
import java.util.*;

@Service
@RequiredArgsConstructor
public class AuthService {
    private final UsuarioRepository repository;
    private final PasswordEncoder passwordEncoder;
    private final RestTemplate restTemplate = new RestTemplate();

    @Value("${jwt.secret}")
    private String jwtSecret;

    public void cadastrarPaciente(UsuarioCadastroDTO dto) {
        if (repository.findByCpf(dto.getCpf()).isPresent()) throw new RuntimeException("CPF já cadastrado");

        String endereco = buscarEndereco(dto.getCep());
        String senhaGerada = gerarSenha();

        Usuario usuario = Usuario.builder()
            .cpf(dto.getCpf())
            .nome(dto.getNome())
            .email(dto.getEmail())
            .cep(dto.getCep())
            .endereco(endereco)
            .senha(passwordEncoder.encode(senhaGerada))
            .tipo(TipoUsuario.PACIENTE)
            .pontos(0)
            .build();

        repository.save(usuario);

        System.out.printf("Senha enviada para o e-mail %s: %s%n", dto.getEmail(), senhaGerada);
    }

    public LoginResponseDTO login(LoginRequestDTO dto) {
        Usuario user = repository.findByEmail(dto.getEmail())
            .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

        if (!passwordEncoder.matches(dto.getSenha(), user.getSenha()))
            throw new RuntimeException("Senha inválida");

        String token = gerarToken(user);
        return new LoginResponseDTO(token);
    }

    private String buscarEndereco(String cep) {
        String url = "https://viacep.com.br/ws/" + cep + "/json/";
        Map<String, String> response = restTemplate.getForObject(url, Map.class);
        return response != null && response.get("logradouro") != null ? response.get("logradouro") : "Endereço não encontrado";
    }

    private String gerarSenha() {
        SecureRandom random = new SecureRandom();
        int senha = 1000 + random.nextInt(9000);
        return String.valueOf(senha);
    }

    private String gerarToken(Usuario usuario) {
        return Jwts.builder()
            .setSubject(usuario.getEmail())
            .claim("tipo", usuario.getTipo().name())
            .setIssuedAt(Date.from(Instant.now()))
            .setExpiration(Date.from(Instant.now().plusSeconds(3600)))
            .signWith(SignatureAlgorithm.HS256, jwtSecret)
            .compact();
    }
}