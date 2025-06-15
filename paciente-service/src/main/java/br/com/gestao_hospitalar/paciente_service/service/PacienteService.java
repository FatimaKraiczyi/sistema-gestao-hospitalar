package br.com.gestao_hospitalar.paciente_service.service;

import br.com.gestao_hospitalar.paciente_service.dto.PacienteRequestDTO;
import br.com.gestao_hospitalar.paciente_service.dto.PacienteResponseDTO;
import br.com.gestao_hospitalar.paciente_service.dto.TransacaoPontosResponseDTO;
import br.com.gestao_hospitalar.paciente_service.entity.Paciente;
import br.com.gestao_hospitalar.paciente_service.entity.TransacaoPontos;
import br.com.gestao_hospitalar.paciente_service.exception.ApiException;
import br.com.gestao_hospitalar.paciente_service.repository.PacienteRepository;
import br.com.gestao_hospitalar.paciente_service.repository.TransacaoPontosRepository;
import br.com.gestao_hospitalar.paciente_service.via_cep.ViaCepResponse;
import com.stripe.Stripe;
import com.stripe.model.checkout.Session;
import com.stripe.param.checkout.SessionCreateParams;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class PacienteService {

  @Autowired
  private PacienteRepository pacienteRepository;

  @Autowired
  private TransacaoPontosRepository transacaoPontosRepository;

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
      .orElseThrow(() ->
        new ApiException("Paciente não encontrado", HttpStatus.NOT_FOUND)
      );

    return toResponseDTO(paciente);
  }

  private void preencherEnderecoViaCep(Paciente paciente, String cep) {
    try {
      String url = "https://viacep.com.br/ws/" + cep + "/json/";
      ViaCepResponse response = restTemplate.getForObject(
        url,
        ViaCepResponse.class
      );

      // Considera válido se erro == null ou erro == false
      boolean cepValido =
        response != null &&
        response.getCep() != null &&
        (response.getErro() == null ||
          Boolean.FALSE.equals(response.getErro()));
      if (cepValido) {
        paciente.setLogradouro(response.getLogradouro());
        paciente.setBairro(response.getBairro());
        paciente.setCidade(response.getLocalidade());
        paciente.setEstado(response.getUf());
      } else {
        throw new ApiException(
          "CEP inválido ou não encontrado",
          HttpStatus.BAD_REQUEST
        );
      }
    } catch (Exception e) {
      throw new ApiException(
        "Erro ao consultar ViaCEP: " + e.getMessage(),
        HttpStatus.BAD_REQUEST
      );
    }
  }

  private PacienteResponseDTO toResponseDTO(Paciente paciente) {
    return new PacienteResponseDTO(paciente);
  }

  public int consultarSaldo(UUID id) {
    Paciente paciente = pacienteRepository
      .findById(id)
      .orElseThrow(() ->
        new ApiException("Paciente não encontrado", HttpStatus.NOT_FOUND)
      );
    return paciente.getPontos();
  }

  public List<TransacaoPontosResponseDTO> consultarHistorico(UUID id) {
    Paciente paciente = pacienteRepository
      .findById(id)
      .orElseThrow(() ->
        new ApiException("Paciente não encontrado", HttpStatus.NOT_FOUND)
      );
    List<TransacaoPontos> transacoes =
      transacaoPontosRepository.findByPacienteOrderByDataDesc(paciente);
    return transacoes
      .stream()
      .map(t -> {
        TransacaoPontosResponseDTO dto = new TransacaoPontosResponseDTO();
        dto.setTipo(t.getTipo());
        dto.setDescricao(t.getDescricao());
        dto.setQuantidade(t.getQuantidade());
        dto.setValorReais(t.getValorReais());
        dto.setData(t.getData());
        return dto;
      })
      .collect(Collectors.toList());
  }

  public void confirmarCompraStripe(UUID pacienteId, String stripeJson) {
    try {
      com.fasterxml.jackson.databind.ObjectMapper mapper =
        new com.fasterxml.jackson.databind.ObjectMapper();
      JsonNode root = mapper.readTree(stripeJson);
      // Extrair status
      String status = root.path("status").asText("");
      String paymentStatus = root.path("payment_status").asText("");
      if (
        !"complete".equalsIgnoreCase(status) ||
        !"paid".equalsIgnoreCase(paymentStatus)
      ) {
        throw new ApiException(
          "Pagamento não está completo ou não foi pago.",
          HttpStatus.BAD_REQUEST
        );
      }
      // Extrair CPF
      String cpf = null;
      JsonNode customFields = root.path("custom_fields");
      if (customFields.isArray()) {
        for (JsonNode field : customFields) {
          if (field.path("key").asText().equals("cpf")) {
            cpf = field.path("numeric").path("value").asText(null);
          }
        }
      }
      // Extrair email
      String email = null;
      if (root.has("customer") && root.path("customer").has("email")) {
        email = root.path("customer").path("email").asText(null);
      }
      if (cpf == null || email == null) {
        throw new ApiException(
          "CPF ou e-mail não informado no pagamento.",
          HttpStatus.BAD_REQUEST
        );
      }
      // Buscar paciente por CPF e email
      Paciente paciente = pacienteRepository
        .findByCpf(cpf)
        .filter(p -> email.equalsIgnoreCase(p.getEmail()))
        .orElseThrow(() ->
          new ApiException(
            "Paciente com CPF e e-mail não localizado.",
            HttpStatus.NOT_FOUND
          )
        );
      // Extrair dados da transação
      int quantidade = 1;
      double valorReais = 0.0;
      String descricao = "COMPRA DE PONTOS (Stripe)";
      JsonNode lineItems = root.path("line_item_group").path("line_items");
      if (lineItems.isArray() && lineItems.size() > 0) {
        JsonNode item = lineItems.get(0);
        quantidade = item.path("quantity").asInt(1);
        valorReais = item.path("total").asDouble(0) / 100.0;
        descricao = item.path("name").asText(descricao);
      }
      // Data da compra
      LocalDateTime dataCompra = LocalDateTime.now();
      // Atualizar pontos
      paciente.setPontos(paciente.getPontos() + quantidade);
      pacienteRepository.save(paciente);
      // Salvar transação
      TransacaoPontos transacao = new TransacaoPontos();
      transacao.setPaciente(paciente);
      transacao.setTipo("ENTRADA");
      transacao.setDescricao(descricao);
      transacao.setQuantidade(quantidade);
      transacao.setValorReais(valorReais);
      transacao.setData(dataCompra);
      transacaoPontosRepository.save(transacao);
    } catch (ApiException e) {
      throw e;
    } catch (Exception e) {
      throw new ApiException(
        "Erro ao processar dados do Stripe: " + e.getMessage(),
        HttpStatus.BAD_REQUEST
      );
    }
  }
}
