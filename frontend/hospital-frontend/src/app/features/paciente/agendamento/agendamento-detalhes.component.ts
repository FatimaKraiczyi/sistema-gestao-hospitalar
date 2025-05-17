import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { ConsultaService, Agendamento } from '../../../core/services/consulta.service';

@Component({
  selector: 'app-agendamento-detalhes',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './agendamento-detalhes.component.html',
  styleUrls: ['./agendamento-detalhes.component.css']
})
export class AgendamentoDetalhesComponent implements OnInit {
  agendamentoId: string = '';
  agendamento: Agendamento | null = null;
  carregando: boolean = true;
  erro: string = '';
  
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private consultaService: ConsultaService
  ) {}
  
  ngOnInit(): void {
    this.agendamentoId = this.route.snapshot.paramMap.get('id') || '';
    if (this.agendamentoId) {
      this.carregarAgendamento();
    } else {
      this.carregando = false;
      this.erro = 'ID de agendamento não fornecido.';
    }
  }
  
  carregarAgendamento(): void {
    this.consultaService.getAgendamentosPaciente().subscribe({
      next: (agendamentos) => {
        const agendamento = agendamentos.find(a => a.id === this.agendamentoId);
        
        if (agendamento) {
          this.agendamento = agendamento;
        } else {
          this.erro = 'Agendamento não encontrado.';
        }
        
        this.carregando = false;
      },
      error: (erro) => {
        console.error('Erro ao carregar agendamento:', erro);
        this.erro = 'Não foi possível carregar as informações do agendamento.';
        this.carregando = false;
      }
    });
  }
  
  getStatusClass(status: string): string {
    switch (status) {
      case 'CRIADO': return 'bg-primary';
      case 'CHECK-IN': return 'bg-info';
      case 'COMPARECEU': return 'bg-info';
      case 'REALIZADO': return 'bg-success';
      case 'FALTOU': return 'bg-danger';
      case 'CANCELADO': return 'bg-warning';
      default: return 'bg-secondary';
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
  
  formatarMoeda(valor: number): string {
    return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  }
}