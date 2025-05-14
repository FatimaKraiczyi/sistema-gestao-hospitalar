package br.com.gestao_hospitalar.auth_service.dto;

public record ViaCepResponse(
    String cep, String logradouro, String bairro, String localidade, String uf
) {}
