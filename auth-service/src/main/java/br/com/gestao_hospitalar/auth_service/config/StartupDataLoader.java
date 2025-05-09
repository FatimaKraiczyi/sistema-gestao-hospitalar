package br.com.gestao_hospitalar.auth_service.config;

import br.com.gestao_hospitalar.auth_service.entity.Usuario;
import br.com.gestao_hospitalar.auth_service.enums.TipoUsuario;
import br.com.gestao_hospitalar.auth_service.repository.UsuarioRepository;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class StartupDataLoader implements CommandLineRunner {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Override
    public void run(String... args) {
        String cpf = "90769281001";
        if (usuarioRepository.findByCpf(cpf).isEmpty()) {
            String salt = "SALT123";
            String rawPassword = "TADS";
            String passwordHash = hashPassword(rawPassword + salt);

            Usuario usuario = Usuario.builder()
                .nome("Funcionário Padrão")
                .cpf(cpf)
                .email("func_pre@hospital.com")
                .senha(passwordHash)
                .tipo(TipoUsuario.FUNCIONARIO)
                .build();

            usuarioRepository.save(usuario);
            System.out.println("✅ Usuário padrão inserido com sucesso.");
        }
    }

    private String hashPassword(String input) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hash = digest.digest(input.getBytes(StandardCharsets.UTF_8));
            StringBuilder hexString = new StringBuilder();
            for (byte b : hash) {
                String hex = Integer.toHexString(0xff & b);
                if (hex.length() == 1) hexString.append('0');
                hexString.append(hex);
            }
            return hexString.toString();
        } catch (NoSuchAlgorithmException e) {
            throw new RuntimeException("Erro ao gerar hash SHA-256", e);
        }
    }
}
