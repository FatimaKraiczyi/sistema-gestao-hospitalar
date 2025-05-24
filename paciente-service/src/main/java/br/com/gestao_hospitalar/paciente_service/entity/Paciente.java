package br.com.gestao_hospitalar.paciente_service.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.util.UUID;

@Entity
@Data
public class Paciente {

    @Id
    @GeneratedValue
    private UUID id; // Chave primária

    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(unique = true, nullable = false)
    private Integer pacienteId; // Número sequencial gerado automaticamente

    @Column(unique = true, nullable = false, length = 11)
    private String cpf;

    @Column(unique = true, nullable = false, length = 255)
    private String email;

    @Column(length = 255)
    private String nome;

    @Column(length = 20)
    private String telefone;

    @Column(length = 10)
    private String cep;

    @Column(length = 255)
    private String logradouro;

    @Column(length = 50)
    private String numero;

    @Column(length = 255)
    private String complemento;

    @Column(length = 255)
    private String bairro;

    @Column(length = 255)
    private String cidade;

    @Column(length = 2)
    private String estado;

    @Column(columnDefinition = "INT DEFAULT 0")
    private Integer pontos;
}