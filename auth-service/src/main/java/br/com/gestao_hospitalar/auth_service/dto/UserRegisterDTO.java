package br.com.gestao_hospitalar.auth_service.dto;

import br.com.gestao_hospitalar.auth_service.enums.UserType;

public class UserRegisterDTO {
    private String email;
    private String cpf;
    private UserType type;

    public UserRegisterDTO() {}

    public UserRegisterDTO(String email, String cpf, UserType type) {
        this.email = email;
        this.cpf = cpf;
        this.type = type;
    }

    // Getters e Setters
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getCpf() { return cpf; }
    public void setCpf(String cpf) { this.cpf = cpf; }

    public UserType getType() { return type; }
    public void setType(UserType type) { this.type = type; }
}
