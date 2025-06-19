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
import com.fasterxml.jackson.databind.JsonNode;
import com.stripe.Stripe;
import com.stripe.model.checkout.Session;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class PacienteService {

  @Value("${stripe.secret}")
  private String stripeSecret;

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

  public void confirmarCompraStripeComSessionId(
    UUID pacienteId,
    String sessionId
  ) {
    try {
      Stripe.apiKey = stripeSecret;

			PaymentLinkCreateParams params =
			PaymentLinkCreateParams.builder()
				.addLineItem(
					PaymentLinkCreateParams.LineItem.builder()
						.setPrice("{{PRICE_ID}}")
						.setQuantity(1L)
						.build()
				)
				.setAfterCompletion(
					PaymentLinkCreateParams.AfterCompletion.builder()
						.setType(PaymentLinkCreateParams.AfterCompletion.Type.REDIRECT)
						.setRedirect(
							PaymentLinkCreateParams.AfterCompletion.Redirect.builder()
								.setUrl("https://example.com/after-checkout?session_id={CHECKOUT_SESSION_ID}")
								.build()
						)
						.build()
				)
				.build();
		
		PaymentLink paymentLink = PaymentLink.create(params);
  }

  public void processarPagamentoStripe(JSONObject session) {
    try {
      // Extrair email e/ou CPF do session
      String email = session.optString("customer_email", null);
      // Se você usa custom_fields para CPF, adapte aqui
      String cpf = null;
      if (session.has("custom_fields")) {
        for (Object fieldObj : session.getJSONArray("custom_fields")) {
          JSONObject field = (JSONObject) fieldObj;
          if ("cpf".equals(field.optString("key"))) {
            cpf = field.getJSONObject("numeric").optString("value", null);
          }
        }
      }
      // Buscar paciente por CPF e/ou email
      Paciente paciente = null;
      if (cpf != null) {
        paciente = pacienteRepository.findByCpf(cpf)
          .filter(p -> email == null || email.equalsIgnoreCase(p.getEmail()))
          .orElse(null);
      } else if (email != null) {
        paciente = pacienteRepository.findByEmail(email).orElse(null);
      }
      if (paciente == null) {
        throw new ApiException("Paciente não localizado para o pagamento Stripe", HttpStatus.NOT_FOUND);
      }
      // Extrair quantidade e valor
      int quantidade = 1;
      double valorReais = 0.0;
      String descricao = "COMPRA DE PONTOS (Stripe)";
      if (session.has("line_items")) {
        JSONObject item = session.getJSONArray("line_items").getJSONObject(0);
        quantidade = item.optInt("quantity", 1);
        valorReais = item.optDouble("amount_total", 0.0) / 100.0;
        descricao = item.optString("description", descricao);
      }
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
      transacao.setData(java.time.LocalDateTime.now());
      transacaoPontosRepository.save(transacao);
    } catch (Exception e) {
      throw new ApiException("Erro ao processar pagamento Stripe: " + e.getMessage(), HttpStatus.BAD_REQUEST);
    }
  }
}
