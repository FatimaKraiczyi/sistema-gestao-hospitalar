package br.com.gestao_hospitalar.auth_service.controller;

import br.com.gestao_hospitalar.auth_service.dto.*;
import br.com.gestao_hospitalar.auth_service.service.UsuarioService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final UsuarioService usuarioService;

    @PostMapping("/register")
    public ResponseEntity<RegisterResponse> registrar(@RequestBody @Valid RegisterRequest request) {
        return ResponseEntity.ok(usuarioService.registrar(request));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody @Valid AuthRequest request) {
        return ResponseEntity.ok(usuarioService.authenticate(request));
    }

    @GetMapping("/teste")
    public ResponseEntity<ApiResponse> teste(HttpServletRequest request) {
        return ResponseEntity.ok(
            ApiResponse.builder()
                .timestamp(java.time.Instant.now())
                .status(200)
                .mensagem("Auth-service está respondendo!")
                .path(request.getRequestURI())
                .build()
        );
    }
}
