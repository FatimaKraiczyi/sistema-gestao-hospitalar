import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../core/auth/auth.service';
import { FuncionarioService, ConsultaFuncionario, AgendamentoFuncionario } from '../../../core/services/funcionario.service';

@Component({
  selector: 'app-funcionario-home',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  consultas: ConsultaFuncionario[] = [];
  carregandoConsultas = true;
  codigoConfirmacao = '';
  consultaSelecionada: ConsultaFuncionario | null = null;
  mostrarModalConfirmacao = false;
  mostrarModalRealizacao = false;
  mostrarModalCancelamento = false;
  acaoModal: 'confirmar' | 'realizar' | 'cancelar' = 'confirmar';
  mensagemSucesso = '';
  mensagemErro = '';

  constructor(
    private authService: AuthService,
    private funcionarioService: FuncionarioService
  ) {}

  ngOnInit(): void {
    this.carregarConsultas();
  }

  carregarConsultas(): void {
    this.carregandoConsultas = true;
    this.funcionarioService.getConsultasProximas48h().subscribe({
      next: (consultas) => {
        this.consultas = consultas;
        this.carregandoConsultas = false;
      },
      error: (erro) => {
        console.error('Erro ao carregar consultas:', erro);
        this.carregandoConsultas = false;
        this.mostrarErro('Erro ao carregar consultas das próximas 48h');
      }
    });
  }

  // R09: Confirmar comparecimento
  abrirModalConfirmacao(consulta: ConsultaFuncionario): void {
    this.consultaSelecionada = consulta;
    this.mostrarModalConfirmacao = true;
    this.codigoConfirmacao = '';
  }

  confirmarComparecimento(): void {
    if (!this.codigoConfirmacao.trim() || !this.consultaSelecionada) {
      this.mostrarErro('Digite o código do agendamento');
      return;
    }

    this.funcionarioService.confirmarComparecimento(this.codigoConfirmacao).subscribe({
      next: (sucesso) => {
        if (sucesso) {
          this.mostrarSucesso('Comparecimento confirmado com sucesso!');
          this.carregarConsultas();
        } else {
          this.mostrarErro('Código inválido ou agendamento não encontrado no status CHECK-IN');
        }
        this.fecharModais();
      },
      error: () => {
        this.mostrarErro('Erro ao confirmar comparecimento');
        this.fecharModais();
      }
    });
  }

  // R10: Cancelar consulta
  abrirModalCancelamento(consulta: ConsultaFuncionario): void {
    this.consultaSelecionada = consulta;
    this.mostrarModalCancelamento = true;
  }

  cancelarConsulta(): void {
    if (!this.consultaSelecionada) return;

    this.funcionarioService.cancelarConsulta(this.consultaSelecionada.codigo).subscribe({
      next: (sucesso) => {
        if (sucesso) {
          this.mostrarSucesso('Consulta cancelada com sucesso! Pontos devolvidos aos pacientes.');
          this.carregarConsultas();
        } else {
          this.mostrarErro('Não é possível cancelar: mais de 50% das vagas estão ocupadas');
        }
        this.fecharModais();
      },
      error: () => {
        this.mostrarErro('Erro ao cancelar consulta');
        this.fecharModais();
      }
    });
  }

  // R11: Realizar consulta
  abrirModalRealizacao(consulta: ConsultaFuncionario): void {
    this.consultaSelecionada = consulta;
    this.mostrarModalRealizacao = true;
  }

  realizarConsulta(): void {
    if (!this.consultaSelecionada) return;

    this.funcionarioService.realizarConsulta(this.consultaSelecionada.codigo).subscribe({
      next: (sucesso) => {
        if (sucesso) {
          this.mostrarSucesso('Consulta realizada! Status dos pacientes atualizado.');
          this.carregarConsultas();
        } else {
          this.mostrarErro('Erro ao realizar consulta');
        }
        this.fecharModais();
      },
      error: () => {
        this.mostrarErro('Erro ao realizar consulta');
        this.fecharModais();
      }
    });
  }

  fecharModais(): void {
    this.mostrarModalConfirmacao = false;
    this.mostrarModalRealizacao = false;
    this.mostrarModalCancelamento = false;
    this.consultaSelecionada = null;
    this.codigoConfirmacao = '';
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
    return data.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  formatarValor(valor: number): string {
    return valor.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    });
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'CRIADO': return 'badge bg-primary';
      case 'CHECK-IN': return 'badge bg-info';
      case 'COMPARECEU': return 'badge bg-success';
      case 'REALIZADO': return 'badge bg-success';
      case 'FALTOU': return 'badge bg-danger';
      case 'CANCELADO': return 'badge bg-warning';
      default: return 'badge bg-secondary';
    }
  }

  calcularPercentualOcupacao(consulta: ConsultaFuncionario): number {
    return Math.round((consulta.vagasOcupadas / consulta.vagasTotal) * 100);
  }

  podeSerCancelada(consulta: ConsultaFuncionario): boolean {
    return this.calcularPercentualOcupacao(consulta) < 50;
  }

  logout(): void {
    this.authService.logout();
    window.location.href = '/login';
  }
}