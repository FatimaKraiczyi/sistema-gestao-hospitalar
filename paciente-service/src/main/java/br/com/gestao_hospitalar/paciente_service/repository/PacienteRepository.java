package br.com.gestao_hospitalar.paciente_service.repository;

import br.com.gestao_hospitalar.paciente_service.entity.Paciente;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface PacienteRepository extends JpaRepository<Paciente, UUID> {
}
