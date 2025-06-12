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
    
    // Construtores
    public MedicoModel() {
    }
    
    public MedicoModel(String id, String nome, String especialidade) {
        this.id = id;
        this.nome = nome;
        this.especialidade = especialidade;
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
}

