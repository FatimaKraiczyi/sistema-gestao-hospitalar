package br.com.gestao_hospitalar.auth_service.dto;

import lombok.*;

@Getter @Setter
public class LoginRequestDTO {
    private String email;
    private String senha;
}