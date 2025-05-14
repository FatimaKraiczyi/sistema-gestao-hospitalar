package br.com.gestao_hospitalar.auth_service.security;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import java.security.MessageDigest;
import java.util.Base64;

public class CustomPasswordEncoder {

    private final BCryptPasswordEncoder bCryptPasswordEncoder = new BCryptPasswordEncoder();

    public String encodeWithSHA256(String rawPassword) {
        // Gera o hash com BCrypt (inclui o salt)
        String bcryptHash = bCryptPasswordEncoder.encode(rawPassword);

        // Extrai o salt do hash do BCrypt (os primeiros 29 caracteres)
        String salt = bcryptHash.substring(0, 29);

        // Aplica SHA-256 usando o salt extraído
        String sha256Hash = hashWithSHA256(rawPassword, salt);

        // Retorna o salt + hash SHA-256
        return salt + ":" + sha256Hash;
    }

    public boolean matches(String rawPassword, String encodedPassword) {
    // Divide o salt e o hash SHA-256 armazenado
    String[] parts = encodedPassword.split(":");
    if (parts.length != 2) {
        return false;  // Se o formato não for correto, retorna falso
    }
    
    String salt = parts[0];  // O salt está antes dos ":"
    String storedHash = parts[1];  // O hash SHA-256 está depois dos ":"

    // Recalcula o hash SHA-256 com o salt
    String computedHash = hashWithSHA256(rawPassword, salt);

    // Compara o hash armazenado com o recalculado
    return storedHash.equals(computedHash);
}

    private String hashWithSHA256(String password, String salt) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            String saltedPassword = salt + password;
            byte[] hash = digest.digest(saltedPassword.getBytes("UTF-8"));
            return Base64.getEncoder().encodeToString(hash);
        } catch (Exception e) {
            throw new RuntimeException("Erro ao gerar hash SHA-256", e);
        }
    }
}
