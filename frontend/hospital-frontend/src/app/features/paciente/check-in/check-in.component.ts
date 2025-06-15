import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { ConsultaService } from '../../../core/services/consulta.service';

@Component({
  selector: 'app-check-in',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './check-in.component.html',
  styleUrls: ['./check-in.component.css']
})
export class CheckInComponent implements OnInit {
  agendamentoId: string | null = null;
  agendamentoSelecionado: any; // Mude para o tipo correto: Agendamento | null = null;
  agendamentosDisponiveis: any[] = [];
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
    this.agendamentoId = this.route.snapshot.paramMap.get('id')!;
    if(this.agendamentoId){
      this.carregarAgendamento();
    } else {
      this.carregarAgendamentosDisponiveis();
    }
  }

  carregarAgendamento(): void {
    this.carregando = true;
    this.consultaService.getAgendamentos().subscribe({
      next: (agendamentos: any[]) => {
        // CORREÇÃO: Use a propriedade com o nome correto
        this.agendamentoSelecionado = agendamentos.find(a => a.id === this.agendamentoId);
        if (!this.agendamentoSelecionado) {
          this.erro = "Agendamento não encontrado ou não disponível para check-in.";
        }
        this.carregando = false;
      },
      error: (erro: any) => {
        this.erro = 'Falha ao carregar dados do agendamento.';
        this.carregando = false;
      }
    });
  }
  
  carregarAgendamentosDisponiveis(): void {
    this.carregando = true;
    this.consultaService.getAgendamentos().subscribe({
        next: (agendamentos: any[]) => {
            this.agendamentosDisponiveis = agendamentos.filter(a =>
                a.status === 'CRIADO' 
            );
            this.carregando = false;
        },
        error: (erro: any) => {
            this.erro = 'Falha ao carregar agendamentos disponíveis.';
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