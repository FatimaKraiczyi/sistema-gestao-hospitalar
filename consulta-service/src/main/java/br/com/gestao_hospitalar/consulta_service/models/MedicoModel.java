package br.com.gestao_hospitalar.consulta_service.models;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Column;

@Entity
public class MedicoModel {
    @Id
    private String id;

    @Column(nullable = false)
    private String nome;

    @Column(nullable = false)
    private String especialidade;

    @Column(nullable = false)
    private String telefone;

    @Column(nullable = false, unique = true)
    private String crm;

    @Column(nullable = false)
    private Boolean ativo;

    // Construtores
    public MedicoModel() {
    }

    public MedicoModel(String id, String nome, String especialidade, String telefone, String crm, Boolean ativo) {
        this.id = id;
        this.nome = nome;
        this.especialidade = especialidade;
        this.telefone = telefone;
        this.crm = crm;
        this.ativo = ativo;
    }

    // Getters e Setters
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public String getEspecialidade() {
        return especialidade;
    }

    public void setEspecialidade(String especialidade) {
        this.especialidade = especialidade;
    }

    public String getTelefone() {
        return telefone;
    }

    public void setTelefone(String telefone) {
        this.telefone = telefone;
    }

    public String getCrm() {
        return crm;
    }

    public void setCrm(String crm) {
        this.crm = crm;
    }

    public Boolean getAtivo() {
        return ativo;
    }

    public void setAtivo(Boolean ativo) {
        this.ativo = ativo;
    }
}
