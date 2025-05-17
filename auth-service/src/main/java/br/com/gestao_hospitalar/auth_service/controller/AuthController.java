package br.com.gestao_hospitalar.auth_service.controller;

import br.com.gestao_hospitalar.auth_service.dto.*;
import br.com.gestao_hospitalar.auth_service.service.UserService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final UserService userService;

    @PostMapping("/register")
    public ResponseEntity<RegisterResponse> register(@RequestBody @Valid RegisterRequest request) {
        return ResponseEntity.ok(userService.register(request));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody @Valid AuthRequest request) {
        return ResponseEntity.ok(userService.authenticate(request));
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<ForgotPasswordResponse> forgotPassword(@RequestBody @Valid ForgotPasswordRequest request) {
        return ResponseEntity.ok(userService.handleForgotPassword(request));
    }

    @PostMapping("/forgot-email")
    public ResponseEntity<ForgotEmailResponse> forgotEmail(@RequestBody @Valid ForgotEmailRequest request) {
        String email = userService.handleForgotEmail(request);
        return ResponseEntity.ok(
            new ForgotEmailResponse(email, "E-mail recuperado com sucesso.", java.time.LocalDateTime.now())
        );
    }

    @GetMapping("/teste")
    public ResponseEntity<ApiResponse> healthCheck(HttpServletRequest request) {
        return ResponseEntity.ok(
            ApiResponse.builder()
                .timestamp(java.time.Instant.now())
                .status(200)
                .message("Auth-service está respondendo!")
                .build()
        );
    }
}