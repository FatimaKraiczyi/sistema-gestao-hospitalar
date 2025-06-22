package br.com.gestao_hospitalar.paciente_service.controller;

import br.com.gestao_hospitalar.paciente_service.dto.*;
import br.com.gestao_hospitalar.paciente_service.service.PacienteService;
import br.com.gestao_hospitalar.paciente_service.util.ResponseUtil;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("")
public class PacienteController {

  @Autowired
  private PacienteService pacienteService;

  @GetMapping("/buscar")
  public ResponseEntity<
    ApiResponse<PacienteResponseDTO>
  > buscarPacientePorIdOuCpf(
    HttpServletRequest request,
    @RequestParam(required = false) UUID id,
    @RequestParam(required = false) String cpf
  ) {
    PacienteResponseDTO paciente = pacienteService.buscarPacientePorIdOuCpf(
      id,
      cpf
    );
    return ResponseEntity.ok(
      ResponseUtil.ok(
        request.getRequestURI(),
        "Paciente encontrado com sucesso",
        paciente
      )
    );
  }

  @GetMapping("/todos")
  public ResponseEntity<
    ApiResponse<List<PacienteResponseDTO>>
  > buscarTodosPacientes(HttpServletRequest request) {
    List<PacienteResponseDTO> pacientes =
      pacienteService.buscarTodosPacientes();
    return ResponseEntity.ok(
      ResponseUtil.ok(
        request.getRequestURI(),
        "Lista de pacientes retornada com sucesso",
        pacientes
      )
    );
  }

  @PutMapping("/editar/{id}")
  public ResponseEntity<ApiResponse<PacienteResponseDTO>> editarPaciente(
    HttpServletRequest request,
    @PathVariable UUID id,
    @RequestBody @Valid PacienteRequestDTO dto
  ) {
    PacienteResponseDTO pacienteAtualizado = pacienteService.editarPaciente(
      id,
      dto
    );
    return ResponseEntity.ok(
      ResponseUtil.ok(
        request.getRequestURI(),
        "Paciente editado com sucesso",
        pacienteAtualizado
      )
    );
  }

  @PostMapping("/completar")
  public ResponseEntity<ApiResponse<PacienteResponseDTO>> completarCadastro(
    HttpServletRequest request,
    @RequestHeader Map<String, String> headers,
    @RequestBody PacienteRequestDTO dto
  ) {
    UUID id = UUID.fromString(headers.get("x-user-id"));
    String cpf = headers.get("x-user-cpf");
    String email = headers.get("x-user-email");

    PacienteResponseDTO response = pacienteService.completarCadastro(
      id,
      cpf,
      email,
      dto
    );
    return ResponseEntity.ok(
      ResponseUtil.ok(
        request.getRequestURI(),
        "Cadastro completado com sucesso",
        response
      )
    );
  }

  @GetMapping("/pontos/saldo")
  public ResponseEntity<ApiResponse<Integer>> consultarSaldo(
    HttpServletRequest request
  ) {
    UUID pacienteId = getPacienteIdFromToken();
    int saldo = pacienteService.consultarSaldo(pacienteId);
    return ResponseEntity.ok(
      ResponseUtil.ok(
        request.getRequestURI(),
        "Saldo de pontos retornado com sucesso",
        saldo
      )
    );
  }

  @GetMapping("/pontos/historico")
  public ResponseEntity<
    ApiResponse<List<TransacaoPontosResponseDTO>>
  > consultarHistorico(HttpServletRequest request) {
    UUID pacienteId = getPacienteIdFromToken();
    List<TransacaoPontosResponseDTO> historico =
      pacienteService.consultarHistorico(pacienteId);
    return ResponseEntity.ok(
      ResponseUtil.ok(
        request.getRequestURI(),
        "Histórico de pontos retornado com sucesso",
        historico
      )
    );
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
