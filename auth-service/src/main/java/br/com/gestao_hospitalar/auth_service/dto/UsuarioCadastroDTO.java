package br.com.gestao_hospitalar.auth_service.dto;

import jakarta.validation.constraints.*;
import lombok.*;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class UsuarioCadastroDTO {
    @NotBlank
    private String cpf;

    @NotBlank
    private String nome;

    @Email
    private String email;

    @Pattern(regexp = "\\d{8}", message = "CEP deve conter 8 dígitos")
    private String cep;
}
