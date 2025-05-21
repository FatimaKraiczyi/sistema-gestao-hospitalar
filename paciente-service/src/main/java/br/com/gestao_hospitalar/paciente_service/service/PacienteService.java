package br.com.gestao_hospitalar.paciente_service.service;

import br.com.gestao_hospitalar.paciente_service.dto.PacienteRequestDTO;
import br.com.gestao_hospitalar.paciente_service.dto.PacienteResponseDTO;
import br.com.gestao_hospitalar.paciente_service.entity.Paciente;
import br.com.gestao_hospitalar.paciente_service.service.ViaCepResponse;
import br.com.gestao_hospitalar.paciente_service.repository.PacienteRepository;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.Optional;
import java.util.UUID;

@Service
public class PacienteService {

    private final PacienteRepository pacienteRepository;
    private final RestTemplate restTemplate = new RestTemplate();

    public PacienteService(PacienteRepository pacienteRepository) {
        this.pacienteRepository = pacienteRepository;
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

    private void preencherEnderecoViaCep(Paciente paciente, String cep) {
        String url = "https://viacep.com.br/ws/" + cep + "/json/";
        try {
            ViaCepResponse response = restTemplate.getForObject(url, ViaCepResponse.class);
            if (response != null && response.getCep() != null && Boolean.FALSE.equals(response.getErro())) {
                paciente.setCep(response.getCep());
                paciente.setLogradouro(response.getLogradouro());
                paciente.setBairro(response.getBairro());
                paciente.setCidade(response.getLocalidade());
                paciente.setEstado(response.getUf());
            }
        } catch (Exception e) {
            System.err.println("Erro ao buscar endereço via CEP: " + e.getMessage());
        }
    }
}
