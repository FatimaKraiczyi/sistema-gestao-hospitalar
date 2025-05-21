package br.com.gestao_hospitalar.paciente_service.service;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Data;

@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class ViaCepResponse {
    private String cep;
    private String logradouro;
    private String bairro;
    private String localidade;  // cidade
    private String uf;          // estado
    private Boolean erro;       // indica se houve erro na consulta
}
