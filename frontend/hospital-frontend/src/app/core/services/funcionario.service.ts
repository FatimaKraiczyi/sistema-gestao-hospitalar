import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';

export interface ConsultaFuncionario {
  codigo: string;
  data: Date;
  especialidade: string;
  medico: string;
  valor: number;
  vagasTotal: number;
  vagasOcupadas: number;
  status: 'DISPONIVEL' | 'CANCELADA' | 'REALIZADA';
  agendamentos: AgendamentoFuncionario[];
}

export interface AgendamentoFuncionario {
  id: string;
  codigoConsulta: string;
  pacienteNome: string;
  pacienteCpf: string;
  status: 'CRIADO' | 'CHECK-IN' | 'COMPARECEU' | 'REALIZADO' | 'FALTOU' | 'CANCELADO';
  pontosUsados: number;
  valorPago: number;
}

export interface NovaConsulta {
  data: Date;
  especialidade: string;
  medico: string;
  valor: number;
  vagas: number;
}

export interface Funcionario {
  id: string;
  nome: string;
  cpf: string;
  email: string;
  telefone: string;
  status: 'ATIVO' | 'INATIVO';
  dataCadastro: Date;
}

export interface NovoFuncionario {
  nome: string;
  cpf: string;
  email: string;
  telefone: string;
}

@Injectable({
  providedIn: 'root'
})
export class FuncionarioService {

  private mockConsultas: ConsultaFuncionario[] = [
    {
      codigo: 'CON001',
      data: new Date(2025, 5, 5, 10, 30), // Próximas 48h
      especialidade: 'CARD',
      medico: 'Dr. Paulo Cardoso',
      valor: 300,
      vagasTotal: 5,
      vagasOcupadas: 2,
      status: 'DISPONIVEL',
      agendamentos: [
        {
          id: '1',
          codigoConsulta: 'CON001',
          pacienteNome: 'Maria da Silva',
          pacienteCpf: '12345678900',
          status: 'CHECK-IN',
          pontosUsados: 5,
          valorPago: 275
        },
        {
          id: '2',
          codigoConsulta: 'CON001',
          pacienteNome: 'João Santos',
          pacienteCpf: '98765432100',
          status: 'CRIADO',
          pontosUsados: 0,
          valorPago: 300
        }
      ]
    },
    {
      codigo: 'CON004',
      data: new Date(2025, 5, 6, 14, 0), // Próximas 48h
      especialidade: 'PED',
      medico: 'Dra. Lúcia Silva',
      valor: 250,
      vagasTotal: 4,
      vagasOcupadas: 1,
      status: 'DISPONIVEL',
      agendamentos: [
        {
          id: '3',
          codigoConsulta: 'CON004',
          pacienteNome: 'Ana Costa',
          pacienteCpf: '11122233344',
          status: 'CRIADO',
          pontosUsados: 10,
          valorPago: 200
        }
      ]
    }
  ];

  private mockFuncionarios: Funcionario[] = [
    {
      id: '1',
      nome: 'Dr. Paulo Cardoso',
      cpf: '23456789012',
      email: 'dr.paulo@hospital.com',
      telefone: '(41) 99999-0001',
      status: 'ATIVO',
      dataCadastro: new Date(2024, 0, 15)
    },
    {
      id: '2',
      nome: 'Dra. Lúcia Silva',
      cpf: '34567890123',
      email: 'dra.lucia@hospital.com',
      telefone: '(41) 99999-0002',
      status: 'ATIVO',
      dataCadastro: new Date(2024, 1, 20)
    },
    {
      id: '3',
      nome: 'Dr. Carlos Santos',
      cpf: '45678901234',
      email: 'dr.carlos@hospital.com',
      telefone: '(41) 99999-0003',
      status: 'INATIVO',
      dataCadastro: new Date(2023, 11, 10)
    }
  ];

  constructor() { }

  // R08: Obter consultas das próximas 48h
  getConsultasProximas48h(): Observable<ConsultaFuncionario[]> {
    const agora = new Date();
    const em48h = new Date(agora.getTime() + 48 * 60 * 60 * 1000);
    
    const consultasProximas = this.mockConsultas.filter(consulta => {
      return consulta.data >= agora && consulta.data <= em48h && consulta.status === 'DISPONIVEL';
    });
    
    return of(consultasProximas).pipe(delay(800));
  }

  // R09: Confirmar comparecimento
  confirmarComparecimento(codigoAgendamento: string): Observable<boolean> {
    const consulta = this.mockConsultas.find(c => 
      c.agendamentos.some(a => a.id === codigoAgendamento)
    );
    
    if (consulta) {
      const agendamento = consulta.agendamentos.find(a => a.id === codigoAgendamento);
      if (agendamento && agendamento.status === 'CHECK-IN') {
        agendamento.status = 'COMPARECEU';
        return of(true).pipe(delay(500));
      }
    }
    
    return of(false).pipe(delay(500));
  }

  // R10: Cancelar consulta
  cancelarConsulta(codigoConsulta: string): Observable<boolean> {
    const consulta = this.mockConsultas.find(c => c.codigo === codigoConsulta);
    
    if (consulta) {
      const percentualOcupacao = (consulta.vagasOcupadas / consulta.vagasTotal) * 100;
      
      if (percentualOcupacao < 50) {
        consulta.status = 'CANCELADA';
        consulta.agendamentos.forEach(agendamento => {
          if (agendamento.status !== 'CANCELADO') {
            agendamento.status = 'CANCELADO';
          }
        });
        return of(true).pipe(delay(800));
      }
    }
    
    return of(false).pipe(delay(500));
  }

  // R11: Realizar consulta
  realizarConsulta(codigoConsulta: string): Observable<boolean> {
    const consulta = this.mockConsultas.find(c => c.codigo === codigoConsulta);
    
    if (consulta) {
      consulta.status = 'REALIZADA';
      consulta.agendamentos.forEach(agendamento => {
        if (agendamento.status === 'COMPARECEU') {
          agendamento.status = 'REALIZADO';
        } else if (['CRIADO', 'CHECK-IN'].includes(agendamento.status)) {
          agendamento.status = 'FALTOU';
        }
      });
      return of(true).pipe(delay(1000));
    }
    
    return of(false).pipe(delay(500));
  }

  // R12: Cadastrar nova consulta
  cadastrarConsulta(novaConsulta: NovaConsulta): Observable<ConsultaFuncionario> {
    const codigo = `CON${(this.mockConsultas.length + 1).toString().padStart(3, '0')}`;
    
    const consulta: ConsultaFuncionario = {
      codigo,
      data: novaConsulta.data,
      especialidade: novaConsulta.especialidade,
      medico: novaConsulta.medico,
      valor: novaConsulta.valor,
      vagasTotal: novaConsulta.vagas,
      vagasOcupadas: 0,
      status: 'DISPONIVEL',
      agendamentos: []
    };
    
    this.mockConsultas.push(consulta);
    return of(consulta).pipe(delay(1200));
  }

  // R13: Listar funcionários
  getFuncionarios(): Observable<Funcionario[]> {
    return of([...this.mockFuncionarios]).pipe(delay(600));
  }

  // R13: Cadastrar funcionário
  cadastrarFuncionario(novoFuncionario: NovoFuncionario): Observable<Funcionario> {
    const funcionario: Funcionario = {
      id: (this.mockFuncionarios.length + 1).toString(),
      nome: novoFuncionario.nome,
      cpf: novoFuncionario.cpf,
      email: novoFuncionario.email,
      telefone: novoFuncionario.telefone,
      status: 'ATIVO',
      dataCadastro: new Date()
    };
    
    this.mockFuncionarios.push(funcionario);
    return of(funcionario).pipe(delay(1000));
  }

  // R14: Atualizar funcionário
  atualizarFuncionario(id: string, dadosAtualizados: Partial<NovoFuncionario>): Observable<boolean> {
    const funcionario = this.mockFuncionarios.find(f => f.id === id);
    
    if (funcionario) {
      if (dadosAtualizados.nome) funcionario.nome = dadosAtualizados.nome;
      if (dadosAtualizados.email) funcionario.email = dadosAtualizados.email;
      if (dadosAtualizados.telefone) funcionario.telefone = dadosAtualizados.telefone;
      
      return of(true).pipe(delay(800));
    }
    
    return of(false).pipe(delay(500));
  }

  // R15: Inativar funcionário
  inativarFuncionario(id: string): Observable<boolean> {
    const funcionario = this.mockFuncionarios.find(f => f.id === id);
    
    if (funcionario) {
      funcionario.status = 'INATIVO';
      return of(true).pipe(delay(600));
    }
    
    return of(false).pipe(delay(500));
  }

  // Reativar funcionário
  reativarFuncionario(id: string): Observable<boolean> {
    const funcionario = this.mockFuncionarios.find(f => f.id === id);
    
    if (funcionario) {
      funcionario.status = 'ATIVO';
      return of(true).pipe(delay(600));
    }
    
    return of(false).pipe(delay(500));
  }

  // Obter funcionário por ID
  getFuncionarioPorId(id: string): Observable<Funcionario | null> {
    const funcionario = this.mockFuncionarios.find(f => f.id === id);
    return of(funcionario || null).pipe(delay(400));
  }
}