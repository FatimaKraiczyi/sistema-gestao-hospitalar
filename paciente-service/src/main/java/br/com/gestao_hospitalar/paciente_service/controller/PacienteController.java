package br.com.gestao_hospitalar.paciente_service.controller;

import br.com.gestao_hospitalar.paciente_service.dto.PacienteRequestDTO;
import br.com.gestao_hospitalar.paciente_service.dto.PacienteResponseDTO;
import br.com.gestao_hospitalar.paciente_service.service.PacienteService;
import jakarta.validation.Valid;
import java.util.Map;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
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
}
