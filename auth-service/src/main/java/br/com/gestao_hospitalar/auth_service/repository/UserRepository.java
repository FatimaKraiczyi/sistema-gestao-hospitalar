package br.com.gestao_hospitalar.auth_service.repository;

import br.com.gestao_hospitalar.auth_service.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByCpf(String cpf);
}
