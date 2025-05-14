package br.com.gestao_hospitalar.auth_service.dto;

public record PacienteDTO(
    @NotBlank String nome,
    @NotBlank String cpf,
		@NotBlank String telefone,
    @NotBlank String email,
    @NotBlank String cep,
    @NotBlank String numero,
    String complemento
) {}

public record FuncionarioDTO(
		@NotBlank String nome,
    @NotBlank String cpf,
		@NotBlank String telefone,
    @NotBlank String email	
) {}