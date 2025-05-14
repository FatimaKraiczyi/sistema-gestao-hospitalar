package br.com.gestao_hospitalar.auth_service.service;

import br.com.gestao_hospitalar.auth_service.dto.*;
import br.com.gestao_hospitalar.auth_service.entity.*;
import br.com.gestao_hospitalar.auth_service.util.ViaCepClient;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Random;

@Service
@RequiredArgsConstructor
public class UsuarioService {

    private final UsuarioRepository repository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final ViaCepClient viaCepClient;
    private final EmailService emailService;

    public void cadastrarPaciente(PacienteDTO dto) {
        if (repository.findByCpf(dto.cpf()).isPresent()) {
            throw new RuntimeException("CPF já cadastrado");
        }

        String senhaGerada = gerarSenha();
        String senhaCriptografada = passwordEncoder.encode(senhaGerada);

        var endereco = viaCepClient.buscarEndereco(dto.cep());

        Paciente paciente = new Paciente();
        paciente.setNome(dto.nome());
        paciente.setCpf(dto.cpf());
        paciente.setEmail(dto.email());
        paciente.setTelefone(dto.telefone());
        paciente.setSenha(senhaCriptografada);
        paciente.setTipo("PACIENTE");
        paciente.setPontos(0);
        paciente.setCep(endereco.cep());
        paciente.setLogradouro(endereco.logradouro());
        paciente.setBairro(endereco.bairro());
        paciente.setCidade(endereco.localidade());
        paciente.setEstado(endereco.uf());
        paciente.setNumero(dto.numero());
        paciente.setComplemento(dto.complemento());

        repository.save(paciente);

        emailService.enviarEmail(dto.email(), "Senha de Acesso", "Sua senha é: " + senhaGerada);
    }

    public void cadastrarFuncionario(FuncionarioDTO dto) {
        if (repository.findByCpf(dto.cpf()).isPresent()) {
            throw new RuntimeException("CPF já cadastrado");
        }

        String senhaGerada = gerarSenha();
        String senhaCriptografada = passwordEncoder.encode(senhaGerada);

        Funcionario funcionario = new Funcionario();
        funcionario.setNome(dto.nome());
        funcionario.setCpf(dto.cpf());
        funcionario.setEmail(dto.email());
        funcionario.setTelefone(dto.telefone());
        funcionario.setSenha(senhaCriptografada);
        funcionario.setTipo("FUNCIONARIO");

        repository.save(funcionario);

        emailService.enviarEmail(dto.email(), "Senha de Acesso", "Sua senha é: " + senhaGerada);
    }

    public String login(LoginDTO dto) {
        Usuario usuario = repository.findByEmail(dto.email())
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

        if (!passwordEncoder.matches(dto.senha(), usuario.getSenha())) {
            throw new RuntimeException("Senha inválida");
        }

        return jwtService.generateToken(usuario);
    }

    private String gerarSenha() {
        return String.format("%04d", new Random().nextInt(10000));
    }
}
