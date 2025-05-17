package br.com.gestao_hospitalar.auth_service.config;

import br.com.gestao_hospitalar.auth_service.entity.Usuario;
import br.com.gestao_hospitalar.auth_service.enums.TipoUsuario;
import br.com.gestao_hospitalar.auth_service.repository.UsuarioRepository;
import br.com.gestao_hospitalar.auth_service.security.CustomPasswordEncoder;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class StartupDataLoader implements CommandLineRunner {

    @Autowired private UsuarioRepository usuarioRepository;
    @Autowired private CustomPasswordEncoder customPasswordEncoder;

    @Override
    public void run(String... args) {
        String cpf = "90769281001";

        if (usuarioRepository.findByCpf(cpf).isEmpty()) {
            String senha = "TADS";
            String senhaCriptografada = customPasswordEncoder.encodeWithSHA256(senha);

            Usuario usuario = Usuario.builder()
                    .cpf(cpf)
                    .email("func_pre@hospital.com")
                    .senha(senhaCriptografada)
                    .tipo(TipoUsuario.FUNCIONARIO)
                    .build();

            usuarioRepository.save(usuario);
            System.out.println("✅ Usuário padrão inserido com sucesso.");
        }
    }
}
