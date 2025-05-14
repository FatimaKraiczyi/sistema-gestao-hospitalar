package br.com.gestao_hospitalar.auth_service.controller;

import br.com.gestao_hospitalar.auth_service.dto.*;
import br.com.gestao_hospitalar.auth_service.service.UsuarioService;
import br.com.gestao_hospitalar.auth_service.service.JwtService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class UsuarioController {

    private final UsuarioService usuarioService;

    @PostMapping("/cadastro/paciente")
    public void cadastroPaciente(@Valid @RequestBody PacienteDTO dto) {
        usuarioService.cadastrarPaciente(dto);
    }

    @PostMapping("/cadastro/funcionario")
    public void cadastroFuncionario(@Valid @RequestBody FuncionarioDTO dto) {
        usuarioService.cadastrarFuncionario(dto);
    }

    @PostMapping("/login")
    public String login(@RequestBody LoginDTO dto) {
        return usuarioService.login(dto);
    }
}

