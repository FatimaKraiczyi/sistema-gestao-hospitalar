import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { SharedStateService } from './shared-state-service';
import { Transacao } from './paciente.service';
import { ApiService } from '../http/api.service';

export interface Especialidade {
  codigo: string;
  nome: string;
}

export interface Medico {
  id: string;
  nome: string;
  especialidade: string;
}

export interface Consulta {
  codigo: string;
  data: Date;
  especialidade: string;
  medico: string;
  valor: number;
  vagasTotal: number;
  vagasDisponiveis: number;
  status: 'DISPONIVEL' | 'CANCELADA';
}

export interface Agendamento {
  id: string;
  codigoConsulta: string;
  codigoPaciente: string;
  data: Date;
  especialidade: string;
  medico: string;
  valor: number;
  pontosUsados: number;
  valorPago: number;
  status: 'CRIADO' | 'CHECK-IN' | 'COMPARECEU' | 'REALIZADO' | 'FALTOU' | 'CANCELADO';
}

@Injectable({
  providedIn: 'root'
})
export class ConsultaService {
    private mockEspecialidades: Especialidade[] = [
        { codigo: 'CARD', nome: 'Cardiologia' },
        { codigo: 'DERM', nome: 'Dermatologia' },
        { codigo: 'PED', nome: 'Pediatria' },
        { codigo: 'GINE', nome: 'Ginecologia' },
        { codigo: 'ORTO', nome: 'Ortopedia' }
    ];

    private mockMedicos: Medico[] = [
        { id: '1', nome: 'Dr. Paulo Cardoso', especialidade: 'CARD' },
        { id: '2', nome: 'Dra. Lúcia Silva', especialidade: 'PED' },
        { id: '3', nome: 'Dr. Carlos Santos', especialidade: 'DERM' }
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
        },
        { 
        codigo: 'CON003', 
        data: new Date(2025, 9, 12, 8, 30), 
        especialidade: 'DERM', 
        medico: 'Dr. Carlos Santos', 
        valor: 200, 
        vagasTotal: 3, 
        vagasDisponiveis: 3,
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

    constructor(private sharedState: SharedStateService, private apiService: ApiService) { }

    // Obter todas as especialidades
    getEspecialidades(): Observable<Especialidade[]> {
        return of(this.mockEspecialidades).pipe(delay(500));
    }

    // Obter médicos por especialidade
    getMedicosPorEspecialidade(especialidadeCodigo: string): Observable<Medico[]> {
        const medicos = this.mockMedicos.filter(m => m.especialidade === especialidadeCodigo);
        return of(medicos).pipe(delay(700));
    }

    // Buscar consultas disponíveis
    buscarConsultasDisponiveis(filtro?: { especialidade?: string, medico?: string }): Observable<Consulta[]> {
        let consultas = [...this.mockConsultas];
        
        if (filtro) {
        if (filtro.especialidade) {
            consultas = consultas.filter(c => c.especialidade === filtro.especialidade);
        }
        
        if (filtro.medico) {
            consultas = consultas.filter(c => c.medico.includes(filtro.medico!));
        }
        }
        
        // Filtra apenas consultas disponíveis e com vagas
        consultas = consultas.filter(c => c.status === 'DISPONIVEL' && c.vagasDisponiveis > 0);
        
        return of(consultas).pipe(delay(800));
    }
  
    // Dentro da classe ConsultaService - método agendarConsulta
    agendarConsulta(codigoConsulta: string, pontosUsados: number): Observable<Agendamento> {
    const consulta = this.mockConsultas.find(c => c.codigo === codigoConsulta);
    
    if (!consulta || consulta.vagasDisponiveis <= 0) {
        throw new Error('Consulta não disponível');
    }
    
    // Calcular valor com desconto (5 reais por ponto)
    const desconto = pontosUsados * 5;
    const valorPago = consulta.valor - desconto;
    
    // Criar novo agendamento
    const novoAgendamento: Agendamento = {
        id: (this.mockAgendamentos.length + 1).toString(),
        codigoConsulta: consulta.codigo,
        codigoPaciente: '2', // ID do paciente mockado
        data: consulta.data,
        especialidade: consulta.especialidade,
        medico: consulta.medico,
        valor: consulta.valor,
        pontosUsados: pontosUsados,
        valorPago: valorPago,
        status: 'CRIADO'
    };
    
    // Atualizar vagas disponíveis
    consulta.vagasDisponiveis--;
    
    // Adicionar ao mock
    this.mockAgendamentos.push(novoAgendamento);
    
    // Atualizar saldo de pontos do paciente através do SharedStateService
    if (pontosUsados > 0) {
        const transacao: Transacao = {
        id: `transacao-${Date.now()}`,
        data: new Date(),
        tipo: 'SAIDA',
        descricao: 'AGENDAMENTO DE CONSULTA',
        valor: 0,
        pontos: pontosUsados
        };
        
        this.sharedState.removePontos(pontosUsados, transacao);
    }
    
    return of(novoAgendamento).pipe(delay(1200));
    }

    // Método cancelarAgendamento
    cancelarAgendamento(agendamentoId: string): Observable<boolean> {
    const agendamento = this.mockAgendamentos.find(a => a.id === agendamentoId);
    
    if (!agendamento || !['CRIADO', 'CHECK-IN'].includes(agendamento.status)) {
        return of(false).pipe(delay(500));
    }
    
    // Atualizar status
    agendamento.status = 'CANCELADO';
    
    // Incrementar vagas na consulta
    const consulta = this.mockConsultas.find(c => c.codigo === agendamento.codigoConsulta);
    if (consulta) {
        consulta.vagasDisponiveis++;
    }
    
    // Devolver os pontos utilizados
    if (agendamento.pontosUsados > 0) {
        const transacao: Transacao = {
        id: `transacao-${Date.now()}`,
        data: new Date(),
        tipo: 'ENTRADA',
        descricao: 'CANCELAMENTO DE AGENDAMENTO',
        valor: 0,
        pontos: agendamento.pontosUsados
        };
        
        this.sharedState.addPontos(agendamento.pontosUsados, transacao);
    }
    
    return of(true).pipe(delay(800));
    }
  

    // Realizar check-in
    realizarCheckIn(agendamentoId: string): Observable<boolean> {
        const agendamento = this.mockAgendamentos.find(a => a.id === agendamentoId);
        
        if (!agendamento || agendamento.status !== 'CRIADO') {
            return of(false).pipe(delay(500));
        }
        
        // Atualizar status
        agendamento.status = 'CHECK-IN';
        
        return of(true).pipe(delay(800));
    }

    getAgendamentos(): Observable<any[]> {
        return this.apiService.get('/agendamentos/paciente');
    }
}