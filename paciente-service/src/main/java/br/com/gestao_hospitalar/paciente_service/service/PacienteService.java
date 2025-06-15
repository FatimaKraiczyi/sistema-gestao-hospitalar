package br.com.gestao_hospitalar.paciente_service.service;

import br.com.gestao_hospitalar.paciente_service.dto.PacienteRequestDTO;
import br.com.gestao_hospitalar.paciente_service.dto.PacienteResponseDTO;
import br.com.gestao_hospitalar.paciente_service.entity.Paciente;
import br.com.gestao_hospitalar.paciente_service.repository.PacienteRepository;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import java.util.UUID;

import br.com.gestao_hospitalar.paciente_service.repository.TransacaoRepository;
import br.com.gestao_hospitalar.paciente_service.entity.Transacao;
import br.com.gestao_hospitalar.paciente_service.dto.PontosDTO;
import org.springframework.transaction.annotation.Transactional;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Service
public class PacienteService {

    private final PacienteRepository pacienteRepository;
    private final TransacaoRepository transacaoRepository;
    private final RestTemplate restTemplate = new RestTemplate();

    public PacienteService(PacienteRepository pacienteRepository, TransacaoRepository transacaoRepository) {
        this.pacienteRepository = pacienteRepository;
        this.transacaoRepository = transacaoRepository;
    }

    @Transactional
    public Paciente comprarPontos(UUID pacienteId, PontosDTO pontosDTO) {
        Paciente paciente = pacienteRepository.findById(pacienteId)
            .orElseThrow(() -> new RuntimeException("Paciente não encontrado com ID: " + pacienteId));

        int quantidadePontos = pontosDTO.getQuantidade();
        if (quantidadePontos <= 0) {
            throw new IllegalArgumentException("A quantidade de pontos para compra deve ser maior que zero.");
        }

        BigDecimal valorCompra = new BigDecimal("5.00").multiply(new BigDecimal(quantidadePontos));
        
        paciente.setPontos(paciente.getPontos() + quantidadePontos);
        pacienteRepository.save(paciente);

        Transacao transacao = new Transacao();
        transacao.setPaciente(paciente);
        transacao.setDescricao("COMPRA DE PONTOS");
        transacao.setPontos(quantidadePontos);
        transacao.setValor(valorCompra);
        transacao.setDataTransacao(LocalDateTime.now());
        transacaoRepository.save(transacao);

        return paciente;
    }

    public Paciente criarOuAtualizarPaciente(PacienteRequestDTO dto) {
        Paciente paciente = pacienteRepository.findById(dto.getId())
                .orElse(new Paciente());

        paciente.setId(dto.getId());
        paciente.setCpf(dto.getCpf());
        paciente.setEmail(dto.getEmail());
        paciente.setNome(dto.getNome());
        paciente.setTelefone(dto.getTelefone());
        paciente.setNumero(dto.getNumero());
        paciente.setComplemento(dto.getComplemento());

        if (dto.getCep() != null) {
            preencherEnderecoViaCep(paciente, dto.getCep());
        }

        if (paciente.getPontos() == null) {
            paciente.setPontos(0);
        }

        return pacienteRepository.save(paciente);
    }

    public Paciente buscarPorId(UUID id) {
        return pacienteRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Paciente não encontrado"));
    }

    public PacienteResponseDTO toResponseDTO(Paciente paciente) {
        PacienteResponseDTO dto = new PacienteResponseDTO();
        dto.setId(paciente.getId());
        dto.setCpf(paciente.getCpf());
        dto.setEmail(paciente.getEmail());
        dto.setNome(paciente.getNome());
        dto.setTelefone(paciente.getTelefone());
        dto.setCep(paciente.getCep());
        dto.setLogradouro(paciente.getLogradouro());
        dto.setNumero(paciente.getNumero());
        dto.setComplemento(paciente.getComplemento());
        dto.setBairro(paciente.getBairro());
        dto.setCidade(paciente.getCidade());
        dto.setEstado(paciente.getEstado());
        dto.setPontos(paciente.getPontos());
        return dto;
    }

    public ViaCepResponse consultarCep(String cep) {
        String url = "https://viacep.com.br/ws/" + cep + "/json/";
        try {
            return restTemplate.getForObject(url, ViaCepResponse.class);
        } catch (Exception e) {
            System.err.println("Erro ao buscar endereço via CEP: " + e.getMessage());
            ViaCepResponse errorResponse = new ViaCepResponse();
            errorResponse.setErro(true);
            return errorResponse;
        }
    }

    private void preencherEnderecoViaCep(Paciente paciente, String cep) {
        ViaCepResponse response = consultarCep(cep);
        if (response != null && (response.getErro() == null || !response.getErro())) {
            paciente.setCep(response.getCep().replaceAll("\\D", ""));
            paciente.setLogradouro(response.getLogradouro());
            paciente.setBairro(response.getBairro());
            paciente.setCidade(response.getLocalidade());
            paciente.setEstado(response.getUf());
        }
    }
}
