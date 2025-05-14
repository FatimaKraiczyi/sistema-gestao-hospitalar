package br.com.gestao_hospitalar.auth_service.service;

import br.com.gestao_hospitalar.auth_service.dto.*;
import br.com.gestao_hospitalar.auth_service.entity.*;
import br.com.gestao_hospitalar.auth_service.util.ViaCepClient;
import br.com.gestao_hospitalar.auth_service.repository.UsuarioRepository;
import br.com.gestao_hospitalar.auth_service.security.CustomPasswordEncoder;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Random;

@Service
@RequiredArgsConstructor
public class UsuarioService {

    private final UsuarioRepository repository;
    private final CustomPasswordEncoder customPasswordEncoder; 
    private final JwtService jwtService;
    private final ViaCepClient viaCepClient;
    private final EmailService emailService;

    public void cadastrarPaciente(PacienteDTO dto) {
    if (repository.findByCpf(dto.getCpf()).isPresent()) {
        throw new RuntimeException("CPF já cadastrado");
    }

    String senhaGerada = gerarSenha();
    String senhaCriptografada = customPasswordEncoder.encodeWithSHA256(senhaGerada);

    var endereco = viaCepClient.buscarEndereco(dto.getCep());

    Paciente paciente = new Paciente();
    paciente.setNome(dto.getNome());
    paciente.setCpf(dto.getCpf());
    paciente.setEmail(dto.getEmail());
    paciente.setTelefone(dto.getTelefone());
    paciente.setSenha(senhaCriptografada); 
    paciente.setTipo("PACIENTE");
    paciente.setPontos(0);
    paciente.setCep(endereco.cep());
    paciente.setLogradouro(endereco.logradouro());
    paciente.setNumero(dto.getNumero());
    paciente.setComplemento(dto.getComplemento());
    paciente.setBairro(endereco.bairro());
    paciente.setCidade(endereco.cidade());
    paciente.setEstado(endereco.estado());

    repository.save(paciente);

    emailService.enviarEmail(dto.getEmail(), "Senha de Acesso", "Sua senha é: " + senhaGerada); 
}

    public void cadastrarFuncionario(FuncionarioDTO dto) {
        if (repository.findByCpf(dto.getCpf()).isPresent()) {
            throw new RuntimeException("CPF já cadastrado");
        }

        String senhaGerada = gerarSenha();
        String senhaCriptografada = customPasswordEncoder.encodeWithSHA256(senhaGerada);

        Funcionario funcionario = new Funcionario();
        funcionario.setNome(dto.getNome());
        funcionario.setCpf(dto.getCpf());
        funcionario.setEmail(dto.getEmail());
        funcionario.setTelefone(dto.getTelefone());
        funcionario.setSenha(senhaCriptografada); 
        funcionario.setTipo("FUNCIONARIO");

        repository.save(funcionario);

        emailService.enviarEmail(dto.getEmail(), "Senha de Acesso", "Sua senha é: " + senhaGerada); 
    }

    public String login(LoginDTO dto) {
        Usuario usuario = repository.findByEmail(dto.email())
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