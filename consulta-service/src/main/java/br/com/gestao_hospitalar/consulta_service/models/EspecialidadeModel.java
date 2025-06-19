package br.com.gestao_hospitalar.consulta_service.models;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Column;
import java.time.LocalDateTime;


@Entity
public class EspecialidadeModel {
    @Id
    private String codigo;
    
    @Column(nullable = false)
    private String nome;

    // Construtores
    public EspecialidadeModel() {
    }

    public EspecialidadeModel(String codigo, String nome) {
        this.codigo = codigo;
        this.nome = nome;
    }

    // Getters e Setters
    public String getCodigo() {
        return codigo;
    }

    public void setCodigo(String codigo) {
        this.codigo = codigo;
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }
}
