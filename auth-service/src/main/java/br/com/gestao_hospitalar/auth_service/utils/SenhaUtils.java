package br.com.gestao_hospitalar.auth_service.utils;

import java.security.MessageDigest;
import java.security.SecureRandom;
import java.util.Base64;
import java.util.Random;

public class SenhaUtils {
    public static String gerarSenhaAleatoria() {
        Random random = new SecureRandom();
        int senha = 1000 + random.nextInt(9000);
        return String.valueOf(senha);
    }

    public static String criptografar(String senha) {
        try {
            MessageDigest md = MessageDigest.getInstance("SHA-256");
            byte[] salt = "saltsuperseguro".getBytes();
            md.update(salt);
            byte[] hash = md.digest(senha.getBytes());
            return Base64.getEncoder().encodeToString(hash);
        } catch (Exception e) {
            throw new RuntimeException("Erro ao criptografar senha");
        }
    }
}