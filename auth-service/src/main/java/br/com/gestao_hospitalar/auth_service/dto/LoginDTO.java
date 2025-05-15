package br.com.gestao_hospitalar.auth_service.dto;

import jakarta.validation.constraints.*;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class LoginDTO {
    @NotBlank @Email
    private String email;
    @NotBlank
    private String senha;
}