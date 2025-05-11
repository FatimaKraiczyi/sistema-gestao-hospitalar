import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PacienteService } from '../../../core/services/paciente.service';
import { ConsultaService, Agendamento } from '../../../core/services/consulta.service';

@Component({
  selector: 'app-paciente-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  saldoPontos: number = 0;
  agendamentos: Agendamento[] = [];
  carregandoPontos: boolean = true;
  carregandoAgendamentos: boolean = true;
  erroCarregamento: string = '';

  constructor(
    private pacienteService: PacienteService,
    private consultaService: ConsultaService
  ) {}

  ngOnInit(): void {
    this.carregarSaldoPontos();
    this.carregarAgendamentos();
  }

  carregarSaldoPontos(): void {
    this.carregandoPontos = true;
    this.pacienteService.getSaldoPontos().subscribe({
      next: (saldo) => {
        this.saldoPontos = saldo;
        this.carregandoPontos = false;
      },
      error: (erro) => {
        console.error('Erro ao carregar saldo de pontos:', erro);
        this.erroCarregamento = 'Não foi possível carregar o saldo de pontos.';
        this.carregandoPontos = false;
      }
    });
  }

  carregarAgendamentos(): void {
    this.carregandoAgendamentos = true;
    this.consultaService.getAgendamentosPaciente().subscribe({
      next: (agendamentos) => {
        this.agendamentos = agendamentos;
        this.carregandoAgendamentos = false;
      },
      error: (erro) => {
        console.error('Erro ao carregar agendamentos:', erro);
        this.erroCarregamento = 'Não foi possível carregar os agendamentos.';
        this.carregandoAgendamentos = false;
      }
    });
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'CRIADO': return 'badge bg-primary';
      case 'CHECK-IN': return 'badge bg-info';
      case 'COMPARECEU': return 'badge bg-info';
      case 'REALIZADO': return 'badge bg-success';
      case 'FALTOU': return 'badge bg-danger';
      case 'CANCELADO': return 'badge bg-warning';
      default: return 'badge bg-secondary';
    }
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
}