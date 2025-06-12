package br.com.gestao_hospitalar.consulta_service.services;

import br.com.gestao_hospitalar.consulta_service.models.MedicoModel;
import br.com.gestao_hospitalar.consulta_service.repositories.MedicoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class MedicoService {
    
    @Autowired
    private MedicoRepository medicoRepository;
    
    public List<MedicoModel> findAll() {
        return medicoRepository.findAll();
    }
    
    public Optional<MedicoModel> findById(String id) {
        return medicoRepository.findById(id);
    }
    
    public List<MedicoModel> findByEspecialidade(String especialidade) {
        return medicoRepository.findByEspecialidade(especialidade);
    }
    
    public MedicoModel save(MedicoModel medico) {
        if (medico.getId() == null || medico.getId().isEmpty()) {
            medico.setId(UUID.randomUUID().toString());
        }
        return medicoRepository.save(medico);
    }
    
    public void deleteById(String id) {
        medicoRepository.deleteById(id);
    }
}