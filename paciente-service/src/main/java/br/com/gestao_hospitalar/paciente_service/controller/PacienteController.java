package br.com.gestao_hospitalar.paciente_service.controller;

import br.com.gestao_hospitalar.paciente_service.dto.PacienteRequestDTO;
import br.com.gestao_hospitalar.paciente_service.dto.PacienteResponseDTO;
import br.com.gestao_hospitalar.paciente_service.service.PacienteService;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("")
@RequiredArgsConstructor
public class PacienteController {

  private final PacienteService pacienteService;

  @PostMapping("/completar")
  public ResponseEntity<PacienteResponseDTO> completarCadastro(
    @RequestHeader("x-user-id") UUID id,
    @RequestHeader("x-user-cpf") String cpf,
    @RequestHeader("x-user-email") String email,
    @RequestBody PacienteRequestDTO dto
  ) {
    return ResponseEntity.ok(
      pacienteService.completarCadastro(id, cpf, email, dto)
    );
  }

  @GetMapping("/perfil")
  public ResponseEntity<PacienteResponseDTO> buscarPaciente(
    @RequestHeader("x-user-id") UUID id
  ) {
    return ResponseEntity.ok(pacienteService.buscarPaciente(id));
  }
}
