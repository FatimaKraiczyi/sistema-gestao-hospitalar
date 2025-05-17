package br.com.gestao_hospitalar.auth_service.dto;

import lombok.Builder;
import lombok.Data;

import java.time.Instant;

@Data
@Builder
public class ApiResponse {
    private Instant timestamp;
    private int status;
    private String message;
}
