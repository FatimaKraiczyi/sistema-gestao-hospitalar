package br.com.gestao_hospitalar.consulta_service.controllers;

import br.com.gestao_hospitalar.consulta_service.models.MedicoModel;
import br.com.gestao_hospitalar.consulta_service.services.MedicoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/medicos")
public class MedicoController {
    
    @Autowired
    private MedicoService medicoService;
    
    @GetMapping
    public ResponseEntity<List<MedicoModel>> findAll(
            @RequestParam(required = false) String especialidade) {
        
        if (especialidade != null && !especialidade.isEmpty()) {
            return ResponseEntity.ok(medicoService.findByEspecialidade(especialidade));
        }
        
        return ResponseEntity.ok(medicoService.findAll());
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<MedicoModel> findById(@PathVariable String id) {
        return medicoService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    
    @PostMapping
    public ResponseEntity<MedicoModel> create(@RequestBody MedicoModel medico) {
        return ResponseEntity.status(HttpStatus.CREATED).body(medicoService.save(medico));
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<MedicoModel> update(@PathVariable String id, @RequestBody MedicoModel medico) {
        if (!medicoService.findById(id).isPresent()) {
            return ResponseEntity.notFound().build();
        }
        
        medico.setId(id);
        return ResponseEntity.ok(medicoService.save(medico));
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable String id) {
        if (!medicoService.findById(id).isPresent()) {
            return ResponseEntity.notFound().build();
        }
        
        medicoService.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}