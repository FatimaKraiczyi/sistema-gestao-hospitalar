package br.com.gestao_hospitalar.auth_service.config;

import br.com.gestao_hospitalar.auth_service.security.CustomPasswordEncoder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class SecurityConfig {

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new PasswordEncoder() {
            private final CustomPasswordEncoder customPasswordEncoder = new CustomPasswordEncoder();

            @Override
            public String encode(CharSequence rawPassword) {
                return customPasswordEncoder.encodeWithSHA256(rawPassword.toString());
            }

            @Override
            public boolean matches(CharSequence rawPassword, String encodedPassword) {
                return customPasswordEncoder.matches(rawPassword.toString(), encodedPassword);
            }
        };
    }
}