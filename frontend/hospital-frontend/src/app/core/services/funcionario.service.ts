import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { Consulta, Agendamento } from './consulta.service';

export interface Funcionario {
  id: string;
  cpf: string;
  nome: string;
  email: string;
  telefone: string;
  status: 'ATIVO' | 'INATIVO';
}

@Injectable({
  providedIn: 'root'
})
export class FuncionarioService {
  private mockFuncionarios: Funcionario[] = [
    {
      id: '1',
      cpf: '90769281001',
      nome: 'Funcionário Padrão',
      email: 'func_pre@hospital.com',
      telefone: '(41) 99999-0001',
      status: 'ATIVO'
    },
    {
      id: '3',
      cpf: '23456789012',
      nome: 'Dr. Paulo Cardoso',
      email: 'dr.paulo@hospital.com',
      telefone: '(41) 99999-0002',
      status: 'ATIVO'
    }
  ];

  private mockConsultas: Consulta[] = [
    { 
      codigo: 'CON001', 
      data: new Date(2025, 7, 10, 10, 30), 
      especialidade: 'CARD', 
      medico: 'Dr. Paulo Cardoso', 
      valor: 300, 
      vagasTotal: 5, 
      vagasDisponiveis: 3,
      status: 'DISPONIVEL'
    },
    { 
      codigo: 'CON002', 
      data: new Date(2025, 8, 11, 9, 30), 
      especialidade: 'PED', 
      medico: 'Dra. Lúcia Silva', 
      valor: 250, 
      vagasTotal: 4, 
      vagasDisponiveis: 2,
      status: 'DISPONIVEL'
    }
  ];

  private mockAgendamentos: Agendamento[] = [
    {
      id: '1',
      codigoConsulta: 'CON001',
      codigoPaciente: '2',
      data: new Date(2025, 7, 10, 10, 30),
      especialidade: 'CARD',
      medico: 'Dr. Paulo Cardoso',
      valor: 300,
      pontosUsados: 5,
      valorPago: 275,
      status: 'CRIADO'
    }
  ];

  constructor() { }

  // Listar consultas nas próximas 48h
  getConsultasProximas48h(): Observable<Consulta[]> {
    const agora = new Date();
    const limite = new Date(agora.getTime() + (48 * 60 * 60 * 1000)); // 48 horas
    
    const consultasProximas = this.mockConsultas.filter(c => 
      c.data >= agora && c.data <= limite && c.status === 'DISPONIVEL'
    );
    
    return of(consultasProximas).pipe(delay(800));
  }

  // Confirmar comparecimento do paciente
  confirmarComparecimento(agendamentoId: string): Observable<boolean> {
    const agendamento = this.mockAgendamentos.find(a => a.id === agendamentoId);
    
    if (!agendamento || agendamento.status !== 'CHECK-IN') {
      return of(false).pipe(delay(500));
    }
    
    // Atualizar status
    agendamento.status = 'COMPARECEU';
    
    return of(true).pipe(delay(800));
  }

  // Cancelar consulta
  cancelarConsulta(codigoConsulta: string): Observable<boolean> {
    const consulta = this.mockConsultas.find(c => c.codigo === codigoConsulta);
    
    if (!consulta) {
      return of(false).pipe(delay(500));
    }
    
    // Verificar se menos de 50% das vagas estão ocupadas
    const vagasOcupadas = consulta.vagasTotal - consulta.vagasDisponiveis;
    if (vagasOcupadas >= consulta.vagasTotal * 0.5) {
      return of(false).pipe(delay(500));
    }
    
    // Atualizar status da consulta
    consulta.status = 'CANCELADA';
    
    // Atualizar status dos agendamentos vinculados
    this.mockAgendamentos
      .filter(a => a.codigoConsulta === codigoConsulta)
      .forEach(a => a.status = 'CANCELADO');
    
    return of(true).pipe(delay(800));
  }

  // Realizar consulta
  realizarConsulta(codigoConsulta: string): Observable<boolean> {
    const agendamentos = this.mockAgendamentos.filter(a => a.codigoConsulta === codigoConsulta);
    
    if (agendamentos.length === 0) {
      return of(false).pipe(delay(500));
    }
    
    // Atualizar status dos agendamentos
    agendamentos.forEach(a => {
      if (a.status === 'COMPARECEU') {
        a.status = 'REALIZADO';
      } else if (['CRIADO', 'CHECK-IN'].includes(a.status)) {
        a.status = 'FALTOU';
      }
    });
    
    return of(true).pipe(delay(800));
  }

  // Cadastrar nova consulta
  cadastrarConsulta(consulta: Omit<Consulta, 'codigo' | 'status' | 'vagasDisponiveis'>): Observable<Consulta> {
    // Gerar código sequencial
    const novoCodigo = `CON${(this.mockConsultas.length + 1).toString().padStart(3, '0')}`;
    
    const novaConsulta: Consulta = {
      ...consulta,
      codigo: novoCodigo,
      status: 'DISPONIVEL',
      vagasDisponiveis: consulta.vagasTotal
    };
    
    this.mockConsultas.push(novaConsulta);
    
    return of(novaConsulta).pipe(delay(1000));
  }
  
  // Listar funcionários
  getFuncionarios(): Observable<Funcionario[]> {
    return of(this.mockFuncionarios).pipe(delay(800));
  }
  
  // Cadastrar funcionário
  cadastrarFuncionario(funcionario: Omit<Funcionario, 'id' | 'status'>): Observable<Funcionario> {
    const novoFuncionario: Funcionario = {
      ...funcionario,
      id: (this.mockFuncionarios.length + 1).toString(),
      status: 'ATIVO'
    };
    
    this.mockFuncionarios.push(novoFuncionario);
    
    return of(novoFuncionario).pipe(delay(1000));
  }
  
  // Atualizar funcionário
  atualizarFuncionario(id: string, funcionario: Omit<Funcionario, 'id' | 'cpf' | 'status'>): Observable<Funcionario | null> {
    const index = this.mockFuncionarios.findIndex(f => f.id === id);
    
    if (index === -1) {
      return of(null).pipe(delay(500));
    }
    
    const funcionarioAtualizado = {
      ...this.mockFuncionarios[index],
      nome: funcionario.nome,
      email: funcionario.email,
      telefone: funcionario.telefone
    };
    
    this.mockFuncionarios[index] = funcionarioAtualizado;
    
    return of(funcionarioAtualizado).pipe(delay(800));
  }
  
  // Inativar funcionário
  inativarFuncionario(id: string): Observable<boolean> {
    const funcionario = this.mockFuncionarios.find(f => f.id === id);
    
    if (!funcionario) {
      return of(false).pipe(delay(500));
    }
    
    funcionario.status = 'INATIVO';
    
    return of(true).pipe(delay(800));
  }
}