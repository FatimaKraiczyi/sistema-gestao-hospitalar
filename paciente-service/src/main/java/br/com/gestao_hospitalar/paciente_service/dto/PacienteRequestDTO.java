package br.com.gestao_hospitalar.paciente_service.dto;

import lombok.Data;

@Data
public class PacienteRequestDTO {

  private String nome;
  private String telefone;
  private String cep;
  private String numero;
  private String complemento;
}
