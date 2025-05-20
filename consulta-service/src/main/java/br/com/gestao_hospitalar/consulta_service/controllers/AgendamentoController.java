package br.com.gestao_hospitalar.consulta_service.controllers;

import br.com.gestao_hospitalar.consulta_service.models.AgendamentoModel;
import br.com.gestao_hospitalar.consulta_service.services.AgendamentoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/agendamentos")
public class AgendamentoController {
    
    @Autowired
    private AgendamentoService agendamentoService;
    
    @GetMapping
    public ResponseEntity<List<AgendamentoModel>> findAll(
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String paciente,
            @RequestParam(required = false) String medico) {
        
        if (status != null && !status.isEmpty()) {
            return ResponseEntity.ok(agendamentoService.findByStatus(status));
        }
        
        if (paciente != null && !paciente.isEmpty()) {
            return ResponseEntity.ok(agendamentoService.findByCodigoPaciente(paciente));
        }
        
        if (medico != null && !medico.isEmpty()) {
            return ResponseEntity.ok(agendamentoService.findByMedico(medico));
        }
        
        return ResponseEntity.ok(agendamentoService.findAll());
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<AgendamentoModel> findById(@PathVariable String id) {
        return agendamentoService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    
    @GetMapping("/periodo")
    public ResponseEntity<List<AgendamentoModel>> findByPeriodo(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime inicio,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime fim) {
        return ResponseEntity.ok(agendamentoService.findByDataBetween(inicio, fim));
    }
    
    @PostMapping
    public ResponseEntity<AgendamentoModel> create(@RequestBody AgendamentoModel agendamento) {
        return ResponseEntity.status(HttpStatus.CREATED).body(agendamentoService.save(agendamento));
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<AgendamentoModel> update(@PathVariable String id, @RequestBody AgendamentoModel agendamento) {
        if (!agendamentoService.findById(id).isPresent()) {
            return ResponseEntity.notFound().build();
        }
        
        agendamento.setId(id);
        return ResponseEntity.ok(agendamentoService.save(agendamento));
    }
    
    @PatchMapping("/{id}/status")
    public ResponseEntity<AgendamentoModel> atualizarStatus(
            @PathVariable String id,
            @RequestParam String status) {
        
        AgendamentoModel agendamentoAtualizado = agendamentoService.atualizarStatus(id, status);
        if (agendamentoAtualizado != null) {
            return ResponseEntity.ok(agendamentoAtualizado);
        }
        return ResponseEntity.notFound().build();
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable String id) {
        if (!agendamentoService.findById(id).isPresent()) {
            return ResponseEntity.notFound().build();
        }
        
        agendamentoService.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}