package br.com.gestao_hospitalar.auth_service.controller;

import br.com.gestao_hospitalar.auth_service.dto.*;
import br.com.gestao_hospitalar.auth_service.service.UsuarioService;
import br.com.gestao_hospitalar.auth_service.service.JwtService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
public class UsuarioController {

    private final UsuarioService usuarioService;

    public UsuarioController(UsuarioService usuarioService) {
        this.usuarioService = usuarioService;
    }

    @PostMapping("/login")
    public ResponseEntity<String> login(@RequestBody LoginDTO dto) {
        String token = usuarioService.login(dto);
        return ResponseEntity.ok(token);
    }

    @PostMapping("/cadastrar")
    public ResponseEntity<Void> registrarUsuario(@RequestBody CadastroDTO dto) {
        usuarioService.cadastrarUsuario(dto);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }
}
