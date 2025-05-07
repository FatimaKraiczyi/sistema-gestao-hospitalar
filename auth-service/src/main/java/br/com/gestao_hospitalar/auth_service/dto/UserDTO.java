package br.com.gestao_hospitalar.auth_service.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Size;

public class UserDTO {

    @NotEmpty(message = "Nome é obrigatório")
    private String nome;

    @NotEmpty(message = "CPF é obrigatório")
    @Size(min = 11, max = 11, message = "CPF deve ter 11 caracteres")
    private String cpf;

    @Email(message = "E-mail inválido")
    @NotEmpty(message = "E-mail é obrigatório")
    private String email;

    @NotEmpty(message = "Senha é obrigatória")
    @Size(min = 6, message = "Senha deve ter no mínimo 6 caracteres")
    private String senha;

    private String tipo;  // "PACIENTE" ou "FUNCIONÁRIO"

    // Getters and Setters
    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public String getCpf() {
        return cpf;
    }

    public void setCpf(String cpf) {
        this.cpf = cpf;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getSenha() {
        return senha;
    }

    public void setSenha(String senha) {
        this.senha = senha;
    }

    public String getTipo() {
        return tipo;
    }

    public void setTipo(String tipo) {
        this.tipo = tipo;
    }
}