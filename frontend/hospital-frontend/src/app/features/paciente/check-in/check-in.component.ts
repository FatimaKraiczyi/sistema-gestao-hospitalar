import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { ConsultaService, Agendamento } from '../../../core/services/consulta.service';

@Component({
  selector: 'app-check-in',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './check-in.component.html',
  styleUrls: ['./check-in.component.css']
})
export class CheckInComponent implements OnInit {
  agendamentoId: string | null = null;
  agendamentosDisponiveis: Agendamento[] = [];
  agendamentoSelecionado: Agendamento | null = null;
  carregando: boolean = true;
  realizandoCheckIn: boolean = false;
  erro: string = '';
  sucesso: string = '';
  
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private consultaService: ConsultaService
  ) {}
  
  ngOnInit(): void {
    // Verificar se foi especificado um ID de agendamento na rota
    this.agendamentoId = this.route.snapshot.paramMap.get('id');
    
    if (this.agendamentoId) {
      // Modo de agendamento específico
      this.carregarAgendamentoEspecifico();
    } else {
      // Modo de lista de agendamentos
      this.carregarAgendamentosDisponiveis();
    }
  }
  
  carregarAgendamentoEspecifico(): void {
    this.consultaService.getAgendamentosPaciente().subscribe({
      next: (agendamentos) => {
        if (this.agendamentoId) {
          const agendamento = agendamentos.find(a => a.id === this.agendamentoId);
          
          if (agendamento && agendamento.status === 'CRIADO') {
            this.agendamentoSelecionado = agendamento;
          } else if (agendamento) {
            this.erro = 'Este agendamento não está disponível para check-in.';
          } else {
            this.erro = 'Agendamento não encontrado.';
          }
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
  
  carregarAgendamentosDisponiveis(): void {
    this.consultaService.getAgendamentosPaciente().subscribe({
      next: (agendamentos) => {
        // Filtrar apenas agendamentos com status 'CRIADO' e dentro das próximas 48h
        const agora = new Date();
        const limite = new Date(agora.getTime() + (48 * 60 * 60 * 1000)); // 48 horas
        
        this.agendamentosDisponiveis = agendamentos.filter(a => 
          a.status === 'CRIADO' && a.data <= limite
        );
        
        this.carregando = false;
      },
      error: (erro) => {
        console.error('Erro ao carregar agendamentos:', erro);
        this.erro = 'Não foi possível carregar os agendamentos disponíveis para check-in.';
        this.carregando = false;
      }
    });
  }
  
  realizarCheckIn(agendamentoId: string): void {
    this.realizandoCheckIn = true;
    
    this.consultaService.realizarCheckIn(agendamentoId).subscribe({
      next: (sucesso) => {
        if (sucesso) {
          this.sucesso = 'Check-in realizado com sucesso!';
          
          // Se estiver no modo lista, remover o agendamento da lista
          if (!this.agendamentoId) {
            this.agendamentosDisponiveis = this.agendamentosDisponiveis.filter(a => a.id !== agendamentoId);
          }
        } else {
          this.erro = 'Não foi possível realizar o check-in. Tente novamente.';
        }
        
        this.realizandoCheckIn = false;
      },
      error: (erro) => {
        console.error('Erro ao realizar check-in:', erro);
        this.erro = 'Ocorreu um erro ao realizar o check-in. Tente novamente.';
        this.realizandoCheckIn = false;
      }
    });
  }
  
  voltar(): void {
    this.router.navigate(['/paciente/home']);
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