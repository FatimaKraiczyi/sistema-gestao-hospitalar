package br.com.gestao_hospitalar.auth_service.dto;

import jakarta.validation.constraints.*;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CadastroDTO {
    @NotBlank @Email private String email;
    @NotBlank private String nome;
    @NotBlank private String cpf;
    @NotBlank private String tipo;
}
