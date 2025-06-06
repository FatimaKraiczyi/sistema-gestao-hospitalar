package br.com.gestao_hospitalar.auth_service.controller;

import br.com.gestao_hospitalar.auth_service.dto.AuthRequest;
import br.com.gestao_hospitalar.auth_service.dto.AuthResponse;
import br.com.gestao_hospitalar.auth_service.dto.ForgotEmailRequest;
import br.com.gestao_hospitalar.auth_service.dto.ForgotPasswordRequest;
import br.com.gestao_hospitalar.auth_service.dto.RegisterRequest;
import br.com.gestao_hospitalar.auth_service.dto.ApiResponse;
import br.com.gestao_hospitalar.auth_service.entity.User;
import br.com.gestao_hospitalar.auth_service.service.UserService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    private UserService userService;
    
    @PostMapping("/register")
		public ResponseEntity<ApiResponse> registerUser(@RequestBody @Valid RegisterRequest request) {
        return ResponseEntity.ok(userService.registerUser(request));
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