package br.com.gestao_hospitalar.consulta_service.repositories;

import br.com.gestao_hospitalar.consulta_service.models.MedicoModel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Repository para operações de persistência de Medico
 */
@Repository
public interface MedicoRepository extends JpaRepository<MedicoModel, String> {
    
    /**
     * Método que busca médicos por especialidade
     * O Spring Data JPA implementa automaticamente este método baseado na convenção de nomenclatura
     * 
     * @param especialidade código da especialidade médica
     * @return lista de médicos que pertencem à especialidade informada
     */
    List<MedicoModel> findByEspecialidade(String especialidade);
}