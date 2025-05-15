package br.com.gestao_hospitalar.auth_service.service;

import br.com.gestao_hospitalar.auth_service.dto.*;
import br.com.gestao_hospitalar.auth_service.entity.*;
import br.com.gestao_hospitalar.auth_service.repository.UsuarioRepository;
import br.com.gestao_hospitalar.auth_service.security.CustomPasswordEncoder;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Random;

@Service
@RequiredArgsConstructor
public class UsuarioService {

    private final UsuarioRepository usuarioRepository;
    private final CustomPasswordEncoder customPasswordEncoder; 
    private final JwtService jwtService;

    public void cadastrarUsuario(CadastroDTO dto) {
    if (usuarioRepository.findByCpf(dto.getCpf()).isPresent()) {
        throw new RuntimeException("CPF já cadastrado");
    }

    String senhaGerada = gerarSenha();
    String senhaCriptografada = customPasswordEncoder.encodeWithSHA256(senhaGerada);

    CadastroDTO usuario = new Usuario();
    usuario.setNome(dto.getNome());
    usuario.setCpf(dto.getCpf());
    usuario.setEmail(dto.getEmail());
    usuario.setSenha(senhaCriptografada); 
    usuario.setTipo(dto.getTipo());

    usuarioRepository.save(usuario);

    emailService.enviarEmail(dto.getEmail(), "Senha de Acesso", "Sua senha é: " + senhaGerada); 
}

    public String login(LoginDTO dto) {
        Usuario usuario = usuarioRepository.findByEmail(dto.email())
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

        // Verifica se a senha fornecida corresponde ao hash armazenado
        if (!customPasswordEncoder.matches(dto.senha(), usuario.getSenha())) { 
            throw new RuntimeException("Senha inválida");
        }

        return jwtService.generateToken(usuario);  // Gera o token JWT se a senha for válida
    }

    private String gerarSenha() {
        return String.format("%04d", new Random().nextInt(10000));  // Senha de 4 dígitos numéricos
    }
}