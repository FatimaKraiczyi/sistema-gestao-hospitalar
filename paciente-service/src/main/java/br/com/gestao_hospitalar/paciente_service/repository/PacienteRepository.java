package br.com.gestao_hospitalar.paciente_service.repository;

import br.com.gestao_hospitalar.paciente_service.entity.Paciente;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PacienteRepository extends JpaRepository<Paciente, UUID> {}
