package br.com.gestao_hospitalar.auth_service.dto;

import jakarta.validation.constraints.*;
import lombok.*;

@Getter
@Setter
public class FuncionarioDTO {

    @NotBlank
    private String nome;

    @NotBlank
    private String cpf;

    @NotBlank
    private String telefone;

    @NotBlank
    private @Email String email;

}
