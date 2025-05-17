package br.com.gestao_hospitalar.auth_service.controller;

import br.com.gestao_hospitalar.auth_service.dto.*;
import br.com.gestao_hospitalar.auth_service.service.UserService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.HttpStatus;
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
		public ResponseEntity<ApiResponse> register(@RequestBody @Valid RegisterRequest request) {
        ApiResponse response = userService.registerUser(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody @Valid AuthRequest request) {
        return ResponseEntity.ok(userService.authenticate(request));
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<ApiResponse> forgotPassword(@RequestBody @Valid ForgotPasswordRequest request) {
        return ResponseEntity.ok(userService.handleForgotPassword(request));
    }

    @PostMapping("/forgot-email")
    public ResponseEntity<ApiResponse> forgotEmail(@RequestBody @Valid ForgotEmailRequest request) {
        return ResponseEntity.ok(userService.handleForgotEmail(request));
		}
  
    @GetMapping("/teste")
    public ResponseEntity<ApiResponse> healthCheck(HttpServletRequest request) {
        return ResponseEntity.ok(new ApiResponse("Auth service is up and running!"));
           
    }
}