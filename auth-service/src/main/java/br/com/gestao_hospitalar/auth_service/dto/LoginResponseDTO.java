package br.com.gestao_hospitalar.auth_service.dto;

import lombok.*;

@Getter @Setter @AllArgsConstructor
public class LoginResponseDTO {
    private String token;
}