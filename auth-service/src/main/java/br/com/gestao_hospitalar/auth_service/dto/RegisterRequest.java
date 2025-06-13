package br.com.gestao_hospitalar.auth_service.dto;

import br.com.gestao_hospitalar.auth_service.enums.UserType;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class RegisterRequest {

		@NotBlank(message = "CPF é obrigatório")
		@Size(min = 11, max = 11, message = "CPF deve conter 11 dígitos")
    private String cpf;

    @NotBlank
    private String name;

    @Email(message = "E-mail inválido")
    @NotBlank(message = "E-mail é obrigatório")
    private String email;

    @NotBlank
    private String cep;

    // @NotNull
    // private UserType type;
}
