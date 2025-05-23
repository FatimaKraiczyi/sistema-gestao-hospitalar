package br.com.gestao_hospitalar.auth_service.entity;

import br.com.gestao_hospitalar.auth_service.enums.UserType;
import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
@Table(name = "account")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false, length = 11)
    private String cpf;

    @Column(unique = true, nullable = false)
    private String email;

    @Column(nullable = false)
    private String password;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private UserType type;
}