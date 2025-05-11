import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { ConsultaService, Agendamento } from '../../../core/services/consulta.service';

@Component({
  selector: 'app-cancelar-agendamento',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './cancelar-agendamento.component.html',
  styleUrls: ['./cancelar-agendamento.component.css']
})
export class CancelarAgendamentoComponent implements OnInit {
  agendamentoId: string = '';
  agendamento: Agendamento | null = null;
  carregando: boolean = true;
  confirmando: boolean = false;
  erro: string = '';
  sucesso: string = '';
  
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
        
        if (agendamento && ['CRIADO', 'CHECK-IN'].includes(agendamento.status)) {
          this.agendamento = agendamento;
        } else if (agendamento) {
          this.erro = 'Este agendamento não pode ser cancelado no status atual.';
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
  
  confirmarCancelamento(): void {
    if (!this.agendamento) return;
    
    this.confirmando = true;
    this.consultaService.cancelarAgendamento(this.agendamentoId).subscribe({
      next: (sucesso) => {
        if (sucesso) {
          this.sucesso = 'Agendamento cancelado com sucesso! Os pontos foram devolvidos ao seu saldo.';
          this.agendamento = null;
          
          // Redirecionar após 3 segundos
          setTimeout(() => {
            this.router.navigate(['/paciente/home']);
          }, 3000);
        } else {
          this.erro = 'Não foi possível cancelar o agendamento.';
        }
        this.confirmando = false;
      },
      error: (erro) => {
        console.error('Erro ao cancelar agendamento:', erro);
        this.erro = 'Ocorreu um erro ao tentar cancelar o agendamento.';
        this.confirmando = false;
      }
    });
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