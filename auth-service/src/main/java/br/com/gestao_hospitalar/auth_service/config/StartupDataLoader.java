package br.com.gestao_hospitalar.auth_service.config;

import br.com.gestao_hospitalar.auth_service.enums.UserType;
import br.com.gestao_hospitalar.auth_service.model.User;
import br.com.gestao_hospitalar.auth_service.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;

@Component
public class StartupDataLoader implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Override
    public void run(String... args) {
        String cpf = "90769281001";
        if (userRepository.findByCpf(cpf).isEmpty()) {
            String salt = "SALT123";
            String rawPassword = "TADS";
            String passwordHash = hashPassword(rawPassword + salt);

            User user = new User();
            user.setName("Funcionário Padrão");
            user.setCpf(cpf);
            user.setEmail("func_pre@hospital.com");
            user.setUserType(UserType.FUNCIONARIO);
            user.setPassword(passwordHash);

            userRepository.save(user);
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