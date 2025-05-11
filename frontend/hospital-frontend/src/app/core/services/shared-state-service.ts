import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Transacao } from './paciente.service';

@Injectable({
  providedIn: 'root'
})
export class SharedStateService {
  // Estado compartilhado para pontos do paciente
  private pontosSaldoSource = new BehaviorSubject<number>(100); // Valor inicial
  pontosSaldo$ = this.pontosSaldoSource.asObservable();
  
  // Estado compartilhado para transações
  private transacoesSource = new BehaviorSubject<Transacao[]>([]);
  transacoes$ = this.transacoesSource.asObservable();

  constructor() {}

  // Atualizar saldo de pontos
  updatePontosSaldo(value: number): void {
    this.pontosSaldoSource.next(value);
  }

  // Obter valor atual do saldo
  getPontosSaldo(): number {
    return this.pontosSaldoSource.value;
  }

  // Adicionar pontos
  addPontos(quantidade: number, transacao: Transacao): void {
    const saldoAtual = this.pontosSaldoSource.value;
    this.pontosSaldoSource.next(saldoAtual + quantidade);
    
    // Adicionar transação ao histórico
    const transacoes = [...this.transacoesSource.value, transacao];
    this.transacoesSource.next(transacoes);
  }

  // Remover pontos
  removePontos(quantidade: number, transacao: Transacao): void {
    const saldoAtual = this.pontosSaldoSource.value;
    this.pontosSaldoSource.next(saldoAtual - quantidade);
    
    // Adicionar transação ao histórico
    const transacoes = [...this.transacoesSource.value, transacao];
    this.transacoesSource.next(transacoes);
  }
  
  // Obter transações
  getTransacoes(): Transacao[] {
    return this.transacoesSource.value;
  }
  
  // Adicionar transação
  addTransacao(transacao: Transacao): void {
    const transacoes = [...this.transacoesSource.value, transacao];
    this.transacoesSource.next(transacoes);
  }
}