package br.com.gestao_hospitalar.paciente_service.service;

import br.com.gestao_hospitalar.paciente_service.dto.PacienteRequestDTO;
import br.com.gestao_hospitalar.paciente_service.dto.PacienteResponseDTO;
import br.com.gestao_hospitalar.paciente_service.entity.Paciente;
import br.com.gestao_hospitalar.paciente_service.repository.PacienteRepository;
import br.com.gestao_hospitalar.paciente_service.via_cep.ViaCepResponse;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class PacienteService {

  @Autowired
  private PacienteRepository pacienteRepository;

  private final RestTemplate restTemplate = new RestTemplate();

  public PacienteResponseDTO completarCadastro(
    UUID id,
    String cpf,
    String email,
    PacienteRequestDTO dto
  ) {
    Paciente paciente = pacienteRepository
      .findById(id)
      .orElseGet(() -> {
        Paciente novoPaciente = new Paciente();
        novoPaciente.setId(id);
        novoPaciente.setCpf(cpf);
        novoPaciente.setEmail(email);
        novoPaciente.setPontos(0); // pontos iniciais
        return novoPaciente;
      });

    paciente.setNome(dto.getNome());
    paciente.setTelefone(dto.getTelefone());
    paciente.setCep(dto.getCep());
    paciente.setNumero(dto.getNumero());
    paciente.setComplemento(dto.getComplemento());

    preencherEnderecoViaCep(paciente, dto.getCep());

    pacienteRepository.save(paciente);
    return toResponseDTO(paciente);
  }

  public PacienteResponseDTO buscarPaciente(UUID id) {
    Paciente paciente = pacienteRepository
      .findById(id)
      .orElseThrow(() -> new RuntimeException("Paciente não encontrado"));

    return toResponseDTO(paciente);
  }

  private void preencherEnderecoViaCep(Paciente paciente, String cep) {
    try {
      String url = "https://viacep.com.br/ws/" + cep + "/json/";
      ViaCepResponse response = restTemplate.getForObject(
        url,
        ViaCepResponse.class
      );

      if (
        response != null &&
        response.getCep() != null &&
        Boolean.FALSE.equals(response.getErro())
      ) {
        paciente.setLogradouro(response.getLogradouro());
        paciente.setBairro(response.getBairro());
        paciente.setCidade(response.getLocalidade());
        paciente.setEstado(response.getUf());
      } else {
        throw new RuntimeException("CEP inválido ou não encontrado");
      }
    } catch (Exception e) {
      throw new RuntimeException("Erro ao consultar ViaCEP: " + e.getMessage());
    }
  }

  private PacienteResponseDTO toResponseDTO(Paciente paciente) {
    return new PacienteResponseDTO(paciente);
  }
}
