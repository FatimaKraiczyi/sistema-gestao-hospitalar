package br.com.gestao_hospitalar.auth_service.dto;

import br.com.gestao_hospitalar.auth_service.enums.TipoUsuario;
import lombok.*;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class UsuarioDTO {
    private String cpf;
    private String email;
    private String nome;
    private String senha;
    private String cep;
    private String endereco;
    private TipoUsuario tipo; 
    private Integer pontos;
}
