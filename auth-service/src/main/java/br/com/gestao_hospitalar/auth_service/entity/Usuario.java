package br.com.gestao_hospitalar.auth_service.entity;

import br.com.gestao_hospitalar.auth_service.enums.TipoUsuario;
import jakarta.persistence.*;
import jakarta.persistence.EnumType;
import lombok.*;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "usuario") 
public class Usuario {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true)
    private String cpf;

    @Column(unique = true)
    private String email;

    private String senha;

    @Enumerated(EnumType.STRING)
    private TipoUsuario tipo;
}
