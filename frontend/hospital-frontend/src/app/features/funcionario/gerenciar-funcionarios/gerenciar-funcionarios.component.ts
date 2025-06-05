import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FuncionarioService, Funcionario, NovoFuncionario } from '../../../core/services/funcionario.service';

@Component({
  selector: 'app-gerenciar-funcionarios',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './gerenciar-funcionarios.component.html',
  styleUrls: ['./gerenciar-funcionarios.component.css']
})
export class GerenciarFuncionariosComponent implements OnInit {
  funcionarios: Funcionario[] = [];
  formulario: FormGroup;
  funcionarioEditando: Funcionario | null = null;
  mostrarFormulario = false;
  carregandoFuncionarios = true;
  salvando = false;
  mensagemSucesso = '';
  mensagemErro = '';

  constructor(
    private fb: FormBuilder,
    private funcionarioService: FuncionarioService
  ) {
    this.formulario = this.fb.group({
      nome: ['', [Validators.required, Validators.minLength(3)]],
      cpf: ['', [Validators.required, Validators.pattern(/^\d{11}$/)]],
      email: ['', [Validators.required, Validators.email]],
      telefone: ['', [Validators.required, Validators.pattern(/^\(\d{2}\)\s\d{4,5}-\d{4}$/)]]
    });
  }

  ngOnInit(): void {
    this.carregarFuncionarios();
  }

  carregarFuncionarios(): void {
    this.carregandoFuncionarios = true;
    this.funcionarioService.getFuncionarios().subscribe({
      next: (funcionarios) => {
        this.funcionarios = funcionarios;
        this.carregandoFuncionarios = false;
      },
      error: (erro) => {
        console.error('Erro ao carregar funcionários:', erro);
        this.mostrarErro('Erro ao carregar lista de funcionários');
        this.carregandoFuncionarios = false;
      }
    });
  }

  abrirFormularioCadastro(): void {
    this.funcionarioEditando = null;
    this.formulario.reset();
    this.mostrarFormulario = true;
  }

  abrirFormularioEdicao(funcionario: Funcionario): void {
    this.funcionarioEditando = funcionario;
    this.formulario.patchValue({
      nome: funcionario.nome,
      cpf: funcionario.cpf,
      email: funcionario.email,
      telefone: funcionario.telefone
    });
    // Desabilitar CPF na edição
    this.formulario.get('cpf')?.disable();
    this.mostrarFormulario = true;
  }

  fecharFormulario(): void {
    this.mostrarFormulario = false;
    this.funcionarioEditando = null;
    this.formulario.reset();
    this.formulario.get('cpf')?.enable();
  }

  onSubmit(): void {
    if (this.formulario.valid) {
      this.salvando = true;

      if (this.funcionarioEditando) {
        // Atualizar funcionário existente
        const dadosAtualizados: Partial<NovoFuncionario> = {
          nome: this.formulario.value.nome,
          email: this.formulario.value.email,
          telefone: this.formulario.value.telefone
        };

        this.funcionarioService.atualizarFuncionario(this.funcionarioEditando.id, dadosAtualizados).subscribe({
          next: (sucesso) => {
            if (sucesso) {
              this.mostrarSucesso('Funcionário atualizado com sucesso!');
              this.carregarFuncionarios();
              this.fecharFormulario();
            } else {
              this.mostrarErro('Erro ao atualizar funcionário');
            }
            this.salvando = false;
          },
          error: () => {
            this.mostrarErro('Erro ao atualizar funcionário');
            this.salvando = false;
          }
        });
      } else {
        // Cadastrar novo funcionário
        const novoFuncionario: NovoFuncionario = {
          nome: this.formulario.value.nome,
          cpf: this.formulario.value.cpf.replace(/\D/g, ''),
          email: this.formulario.value.email,
          telefone: this.formulario.value.telefone
        };

        this.funcionarioService.cadastrarFuncionario(novoFuncionario).subscribe({
          next: (funcionario) => {
            this.mostrarSucesso(`Funcionário ${funcionario.nome} cadastrado com sucesso! Senha enviada por e-mail.`);
            this.carregarFuncionarios();
            this.fecharFormulario();
            this.salvando = false;
          },
          error: () => {
            this.mostrarErro('Erro ao cadastrar funcionário');
            this.salvando = false;
          }
        });
      }
    } else {
      this.marcarCamposInvalidos();
    }
  }

  inativarFuncionario(funcionario: Funcionario): void {
    if (confirm(`Tem certeza que deseja inativar ${funcionario.nome}?`)) {
      this.funcionarioService.inativarFuncionario(funcionario.id).subscribe({
        next: (sucesso) => {
          if (sucesso) {
            this.mostrarSucesso(`${funcionario.nome} foi inativado com sucesso`);
            this.carregarFuncionarios();
          } else {
            this.mostrarErro('Erro ao inativar funcionário');
          }
        },
        error: () => {
          this.mostrarErro('Erro ao inativar funcionário');
        }
      });
    }
  }

  reativarFuncionario(funcionario: Funcionario): void {
    if (confirm(`Tem certeza que deseja reativar ${funcionario.nome}?`)) {
      this.funcionarioService.reativarFuncionario(funcionario.id).subscribe({
        next: (sucesso) => {
          if (sucesso) {
            this.mostrarSucesso(`${funcionario.nome} foi reativado com sucesso`);
            this.carregarFuncionarios();
          } else {
            this.mostrarErro('Erro ao reativar funcionário');
          }
        },
        error: () => {
          this.mostrarErro('Erro ao reativar funcionário');
        }
      });
    }
  }

  marcarCamposInvalidos(): void {
    Object.keys(this.formulario.controls).forEach(campo => {
      const controle = this.formulario.get(campo);
      if (controle) {
        controle.markAsTouched();
      }
    });
  }

  isInvalido(campo: string): boolean {
    const controle = this.formulario.get(campo);
    return !!(controle && controle.invalid && controle.touched);
  }

  getMensagemErro(campo: string): string {
    const controle = this.formulario.get(campo);
    if (controle && controle.errors && controle.touched) {
      if (controle.errors['required']) return `${campo} é obrigatório`;
      if (controle.errors['email']) return 'E-mail inválido';
      if (controle.errors['minlength']) return `${campo} deve ter pelo menos ${controle.errors['minlength'].requiredLength} caracteres`;
      if (controle.errors['pattern']) {
        if (campo === 'cpf') return 'CPF deve ter 11 dígitos';
        if (campo === 'telefone') return 'Telefone deve estar no formato (XX) XXXXX-XXXX';
      }
    }
    return '';
  }

  formatarTelefone(event: any): void {
    let valor = event.target.value.replace(/\D/g, '');
    if (valor.length <= 11) {
      valor = valor.replace(/^(\d{2})(\d)/g, '($1) $2');
      valor = valor.replace(/(\d)(\d{4})$/, '$1-$2');
      this.formulario.patchValue({ telefone: valor });
    }
  }

  formatarCpf(event: any): void {
    let valor = event.target.value.replace(/\D/g, '');
    if (valor.length <= 11) {
      this.formulario.patchValue({ cpf: valor });
    }
  }

  mostrarSucesso(mensagem: string): void {
    this.mensagemSucesso = mensagem;
    this.mensagemErro = '';
    setTimeout(() => this.mensagemSucesso = '', 5000);
  }

  mostrarErro(mensagem: string): void {
    this.mensagemErro = mensagem;
    this.mensagemSucesso = '';
    setTimeout(() => this.mensagemErro = '', 5000);
  }

  formatarData(data: Date): string {
    return data.toLocaleDateString('pt-BR');
  }

  formatarCpfExibicao(cpf: string): string {
    return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  }
}