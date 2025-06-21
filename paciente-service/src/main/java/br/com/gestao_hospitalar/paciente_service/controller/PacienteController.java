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

  @GetMapping("/usuario")
  public ResponseEntity<PacienteResponseDTO> buscarPacientePorId(
    @RequestParam UUID id
  ) {
    PacienteResponseDTO paciente = pacienteService.buscarPaciente(id);
    return ResponseEntity.ok(paciente);
  }

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

  private UUID getPacienteIdFromToken() {
    Authentication authentication = SecurityContextHolder.getContext()
      .getAuthentication();
    if (authentication == null || authentication.getPrincipal() == null) {
      throw new RuntimeException("Usuário não autenticado");
    }
    return UUID.fromString(authentication.getPrincipal().toString());
  }
}
