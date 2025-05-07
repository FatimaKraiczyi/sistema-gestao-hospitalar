package br.com.gestao_hospitalar.auth_service.model;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;

@Entity
public class Role {

    @Id
    private String roleName;

    // Getters e Setters
    public String getRoleName() {
        return roleName;
    }

    public void setRoleName(String roleName) {
        this.roleName = roleName;
    }
}
