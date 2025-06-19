package br.com.gestao_hospitalar.paciente_service.controller;

import br.com.gestao_hospitalar.paciente_service.dto.PacienteRequestDTO;
import br.com.gestao_hospitalar.paciente_service.dto.PacienteResponseDTO;
import br.com.gestao_hospitalar.paciente_service.dto.TransacaoPontosResponseDTO;
import br.com.gestao_hospitalar.paciente_service.service.PacienteService;
import jakarta.validation.Valid;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("")
public class PacienteController {

  @Autowired
  private PacienteService pacienteService;

  @PostMapping("/completar")
  public ResponseEntity<PacienteResponseDTO> completarCadastro(
    @RequestHeader Map<String, String> headers,
    @RequestBody PacienteRequestDTO dto
  ) {
    headers.forEach((key, value) -> System.out.println(key + " = " + value));

    UUID id = UUID.fromString(headers.get("x-user-id"));
    String cpf = headers.get("x-user-cpf");
    String email = headers.get("x-user-email");

    PacienteResponseDTO response = pacienteService.completarCadastro(
      id,
      cpf,
      email,
      dto
    );
    return ResponseEntity.ok(response);
  }

  @PostMapping("/pontos/confirmar-compra")
  public ResponseEntity<String> confirmarCompraStripe(
    @RequestBody StripeSessionDTO dto
  ) {
    UUID pacienteId = getPacienteIdFromToken();
    pacienteService.confirmarCompraStripeComSessionId(
      pacienteId,
      dto.getSessionId()
    );
    return ResponseEntity.ok("Compra confirmada e pontos creditados.");
  }

  @GetMapping("/pontos/saldo")
  public ResponseEntity<Integer> consultarSaldo() {
    UUID pacienteId = getPacienteIdFromToken();
    int saldo = pacienteService.consultarSaldo(pacienteId);
    return ResponseEntity.ok(saldo);
  }

  @GetMapping("/pontos/historico")
  public ResponseEntity<List<TransacaoPontosResponseDTO>> consultarHistorico() {
    UUID pacienteId = getPacienteIdFromToken();
    List<TransacaoPontosResponseDTO> historico =
      pacienteService.consultarHistorico(pacienteId);
    return ResponseEntity.ok(historico);
  }

  @PostMapping("/pontos/stripe-webhook")
  public ResponseEntity<String> stripeWebhook(
    @RequestBody String payload,
    @RequestHeader(
      value = "Stripe-Signature",
      required = false
    ) String sigHeader
  ) {
    try {
      // (Opcional) Validar assinatura do Stripe usando sigHeader e endpoint secret
      JSONObject eventJson = new JSONObject(payload);
      String eventType = eventJson.getString("type");
      if ("checkout.session.completed".equals(eventType)) {
        JSONObject session = eventJson
          .getJSONObject("data")
          .getJSONObject("object");
        pacienteService.processarPagamentoStripe(session);
      }
      return ResponseEntity.ok("");
    } catch (Exception e) {
      return ResponseEntity.status(400).body(
        "Webhook error: " + e.getMessage()
      );
    }
  }

  private UUID getPacienteIdFromToken() {
    Authentication authentication = SecurityContextHolder.getContext()
      .getAuthentication();
    if (authentication == null || authentication.getPrincipal() == null) {
      throw new RuntimeException("Usuário não autenticado");
    }
    return UUID.fromString(authentication.getPrincipal().toString());
  }
}
