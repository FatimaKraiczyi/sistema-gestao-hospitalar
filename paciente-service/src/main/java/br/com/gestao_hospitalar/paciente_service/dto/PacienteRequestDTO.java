package br.com.gestao_hospitalar.paciente_service.dto;

import lombok.Data;

import java.util.UUID;

@Data
public class PacienteRequestDTO {
    private UUID id;
    private String cpf;
    private String email;
    private String nome;
    private String telefone;
    private String cep;
    private String numero;
    private String complemento;
}
