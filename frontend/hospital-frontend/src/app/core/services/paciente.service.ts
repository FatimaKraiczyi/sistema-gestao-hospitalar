import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay, map } from 'rxjs/operators';
import { SharedStateService } from './shared-state-service';

export interface Paciente {
  id: string;
  cpf: string;
  name: string;
  email: string;
  endereco: string;
  pontos: number;
}

export interface Transacao {
  id: string;
  data: Date;
  tipo: 'ENTRADA' | 'SAIDA';
  descricao: string;
  valor: number;
  pontos: number;
}

@Injectable({
  providedIn: 'root'
})
export class PacienteService {
  private mockPaciente: Paciente = {
    id: '2',
    cpf: '12345678900',
    name: 'Paciente Teste',
    email: 'paciente@teste.com',
    endereco: 'Rua A, 123 - Centro - Curitiba, PR - CEP 80000-000',
    pontos: 100
  };

  private mockTransacoes: Transacao[] = [
    { id: '1', data: new Date(2025, 4, 1), tipo: 'ENTRADA', descricao: 'COMPRA DE PONTOS', valor: 50, pontos: 10 },
    { id: '2', data: new Date(2025, 4, 5), tipo: 'SAIDA', descricao: 'AGENDAMENTO DE CONSULTA', valor: 0, pontos: 5 },
    { id: '3', data: new Date(2025, 4, 8), tipo: 'ENTRADA', descricao: 'CANCELAMENTO DE AGENDAMENTO', valor: 0, pontos: 5 }
  ];

  constructor(private sharedState: SharedStateService) {
    // Inicializar o estado compartilhado
    this.sharedState.updatePontosSaldo(this.mockPaciente.pontos);
    
    // Inicializar transações
    this.mockTransacoes.forEach(transacao => {
      this.sharedState.addTransacao(transacao);
    });
  }

  // Obter dados do paciente
  getPacienteData(): Observable<Paciente> {
    // Sempre atualizar os pontos no objeto do mock com o valor mais recente do estado compartilhado
    this.mockPaciente.pontos = this.sharedState.getPontosSaldo();
    return of(this.mockPaciente).pipe(delay(800));
  }

  // Obter saldo de pontos
  getSaldoPontos(): Observable<number> {
    return this.sharedState.pontosSaldo$;
  }

  // Comprar pontos
  comprarPontos(quantidade: number): Observable<Transacao> {
    const valorTotal = quantidade * 5; // 1 ponto = R$ 5,00
    const novaTransacao: Transacao = {
      id: (this.mockTransacoes.length + 1).toString(),
      data: new Date(),
      tipo: 'ENTRADA',
      descricao: 'COMPRA DE PONTOS',
      valor: valorTotal,
      pontos: quantidade
    };
    
    this.mockTransacoes.push(novaTransacao);
    
    // Atualizar o estado compartilhado
    this.sharedState.addPontos(quantidade, novaTransacao);
    
    return of(novaTransacao).pipe(delay(1000));
  }

  // Obter histórico de transações
  getHistoricoTransacoes(): Observable<Transacao[]> {
    return this.sharedState.transacoes$;
  }

  // Buscar endereço pelo CEP (simula integração com ViaCEP)
  buscarEnderecoPorCep(cep: string): Observable<any> {
    // Simula retorno da API ViaCEP
    const mockEndereco = {
      cep: cep,
      logradouro: 'Rua Exemplo',
      complemento: '',
      bairro: 'Centro',
      localidade: 'Curitiba',
      uf: 'PR',
      ibge: '4106902',
      gia: '',
      ddd: '41',
      siafi: '7535'
    };
    
    return of(mockEndereco).pipe(delay(1000));
  }
}