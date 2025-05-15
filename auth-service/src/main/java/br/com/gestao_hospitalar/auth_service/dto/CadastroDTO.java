package br.com.gestao_hospitalar.auth_service.dto;

import jakarta.validation.constraints.*;

public record CadastroDTO(
    @NotBlank @Email String email,
		@NotBlank String nome,
		@NotBlank String cpf,
		@NotBlank String senha,
		@NotBlank String tipo,
) {}