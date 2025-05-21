package br.com.gestao_hospitalar.paciente_service.controller;

import br.com.gestao_hospitalar.paciente_service.dto.PacienteRequestDTO;
import br.com.gestao_hospitalar.paciente_service.dto.PacienteResponseDTO;
import br.com.gestao_hospitalar.paciente_service.entity.Paciente;
import br.com.gestao_hospitalar.paciente_service.service.PacienteService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/paciente")
@RequiredArgsConstructor
public class PacienteController {

    private final PacienteService pacienteService;

    @PostMapping
    public ResponseEntity<PacienteResponseDTO> criarOuAtualizar(@RequestBody PacienteRequestDTO dto) {
        Paciente paciente = pacienteService.criarOuAtualizarPaciente(dto);
        PacienteResponseDTO responseDTO = pacienteService.toResponseDTO(paciente);
        return ResponseEntity.ok(responseDTO);
    }

    @GetMapping("/{id}")
    public ResponseEntity<PacienteResponseDTO> buscarPorId(@PathVariable UUID id) {
        Paciente paciente = pacienteService.buscarPorId(id);
        PacienteResponseDTO responseDTO = pacienteService.toResponseDTO(paciente);
        return ResponseEntity.ok(responseDTO);
    }
}
