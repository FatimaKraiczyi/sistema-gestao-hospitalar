package br.com.gestao_hospitalar.auth_service.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
public class ForgotEmailResponse {
    private String email;
    private String message;
    private LocalDateTime timestamp;
}
