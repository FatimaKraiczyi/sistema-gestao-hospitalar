import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PacienteService, Transacao } from '../../../../core/services/paciente.service';

@Component({
  selector: 'app-extrato-pontos',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './extrato-pontos.component.html',
  styleUrls: ['./extrato-pontos.component.css']
})
export class ExtratoPontosComponent implements OnInit {
  saldoPontos: number = 0;
  transacoes: Transacao[] = [];
  carregando: boolean = true;
  erro: string = '';
  
  constructor(private pacienteService: PacienteService) {}
  
  ngOnInit(): void {
    this.carregarDados();
  }
  
  carregarDados(): void {
    this.carregando = true;
    
    // Carregar saldo de pontos
    this.pacienteService.getSaldoPontos().subscribe({
      next: (saldo) => {
        this.saldoPontos = saldo;
        
        // Após carregar o saldo, carregar o histórico de transações
        this.pacienteService.getHistoricoTransacoes().subscribe({
          next: (transacoes) => {
            this.transacoes = transacoes.sort((a, b) => b.data.getTime() - a.data.getTime()); // Ordenar por data (mais recente primeiro)
            this.carregando = false;
          },
          error: (erro) => {
            console.error('Erro ao carregar histórico de transações:', erro);
            this.erro = 'Não foi possível carregar o histórico de transações.';
            this.carregando = false;
          }
        });
      },
      error: (erro) => {
        console.error('Erro ao carregar saldo de pontos:', erro);
        this.erro = 'Não foi possível carregar o saldo de pontos.';
        this.carregando = false;
      }
    });
  }
  
  getTipoClass(tipo: string): string {
    return tipo === 'ENTRADA' ? 'text-success' : 'text-danger';
  }
  
  formatarData(data: Date): string {
    return data.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  }
  
  formatarMoeda(valor: number): string {
    return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  }
}