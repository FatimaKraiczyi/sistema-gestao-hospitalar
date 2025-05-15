package br.com.gestao_hospitalar.auth_service.dto;

import jakarta.validation.constraints.*;

public record LoginDTO(
    @NotBlank @Email String email,
    @NotBlank String senha
) {}
