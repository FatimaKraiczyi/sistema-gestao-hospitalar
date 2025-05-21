package br.com.gestao_hospitalar.paciente_service.dto;

import lombok.Data;

import java.util.UUID;

@Data
public class PacienteResponseDTO {
    private UUID id;
    private String cpf;
    private String email;
    private String nome;
    private String telefone;
    private String cep;
    private String logradouro;
    private String numero;
    private String complemento;
    private String bairro;
    private String cidade;
    private String estado;
    private Integer pontos;
}
