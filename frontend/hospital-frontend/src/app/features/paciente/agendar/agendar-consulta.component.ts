import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { ConsultaService, Especialidade, Medico, Consulta } from '../../../core/services/consulta.service';
import { PacienteService } from '../../../core/services/paciente.service';

@Component({
  selector: 'app-agendar-consulta',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './agendar-consulta.component.html',
  styleUrls: ['./agendar-consulta.component.css']
})
export class AgendarConsultaComponent implements OnInit {
  filtroForm: FormGroup;
  especialidades: Especialidade[] = [];
  medicos: Medico[] = [];
  consultas: Consulta[] = [];
  consultaSelecionada: Consulta | null = null;
  saldoPontos: number = 0;
  pontosParaUsar: number = 0;
  
  carregandoEspecialidades: boolean = false;
  carregandoMedicos: boolean = false;
  carregandoConsultas: boolean = false;
  carregandoPontos: boolean = false;
  enviandoAgendamento: boolean = false;
  
  erro: string = '';
  sucesso: string = '';
  etapaAtual: 'busca' | 'selecao' | 'confirmacao' | 'finalizado' = 'busca';
  
  constructor(
    private fb: FormBuilder,
    private consultaService: ConsultaService,
    private pacienteService: PacienteService,
    private router: Router
  ) {
    this.filtroForm = this.fb.group({
      especialidade: [''],
      medico: ['']
    });
  }
  
  ngOnInit(): void {
    this.carregarEspecialidades();
    this.carregarSaldoPontos();
    
    // Monitorar mudanças na especialidade para carregar médicos relacionados
    this.filtroForm.get('especialidade')?.valueChanges.subscribe(especialidadeCodigo => {
      if (especialidadeCodigo) {
        this.carregarMedicosPorEspecialidade(especialidadeCodigo);
      } else {
        this.medicos = [];
      }
      
      // Resetar médico selecionado quando mudar a especialidade
      this.filtroForm.get('medico')?.setValue('');
    });
  }
  
  carregarEspecialidades(): void {
    this.carregandoEspecialidades = true;
    this.consultaService.getEspecialidades().subscribe({
      next: (especialidades) => {
        this.especialidades = especialidades;
        this.carregandoEspecialidades = false;
      },
      error: (erro) => {
        console.error('Erro ao carregar especialidades:', erro);
        this.erro = 'Não foi possível carregar as especialidades médicas.';
        this.carregandoEspecialidades = false;
      }
    });
  }
  
  carregarMedicosPorEspecialidade(especialidadeCodigo: string): void {
    this.carregandoMedicos = true;
    this.consultaService.getMedicosPorEspecialidade(especialidadeCodigo).subscribe({
      next: (medicos) => {
        this.medicos = medicos;
        this.carregandoMedicos = false;
      },
      error: (erro) => {
        console.error('Erro ao carregar médicos:', erro);
        this.erro = 'Não foi possível carregar os médicos para esta especialidade.';
        this.carregandoMedicos = false;
      }
    });
  }
  
  carregarSaldoPontos(): void {
    this.carregandoPontos = true;
    this.pacienteService.getSaldoPontos().subscribe({
      next: (saldo) => {
        this.saldoPontos = saldo;
        this.carregandoPontos = false;
      },
      error: (erro) => {
        console.error('Erro ao carregar saldo de pontos:', erro);
        this.erro = 'Não foi possível carregar seu saldo de pontos.';
        this.carregandoPontos = false;
      }
    });
  }
  
  buscarConsultas(): void {
    this.consultaSelecionada = null;
    const especialidade = this.filtroForm.get('especialidade')?.value;
    const medico = this.filtroForm.get('medico')?.value;
    
    if (!especialidade && !medico) {
      this.erro = 'Selecione pelo menos uma especialidade ou médico para buscar.';
      return;
    }
    
    this.carregandoConsultas = true;
    this.consultaService.buscarConsultasDisponiveis({ 
      especialidade: especialidade, 
      medico: medico 
    }).subscribe({
      next: (consultas) => {
        this.consultas = consultas;
        this.carregandoConsultas = false;
        this.erro = '';
      },
      error: (erro) => {
        console.error('Erro ao buscar consultas:', erro);
        this.erro = 'Não foi possível buscar as consultas disponíveis.';
        this.carregandoConsultas = false;
      }
    });
  }
  
  selecionarConsulta(consulta: Consulta): void {
    this.consultaSelecionada = consulta;
    this.etapaAtual = 'selecao';
    this.pontosParaUsar = 0; // Reiniciar pontos
  }
  
  calcularDesconto(pontosParaUsar: number): number {
    return pontosParaUsar * 5; // Cada ponto vale R$ 5,00
  }
  
  calcularValorFinal(): number {
    if (!this.consultaSelecionada) return 0;
    
    const valorConsulta = this.consultaSelecionada.valor;
    const desconto = this.calcularDesconto(this.pontosParaUsar);
    return valorConsulta - desconto;
  }
  
  incrementarPontos(): void {
    if (this.pontosParaUsar < this.saldoPontos && 
        this.calcularDesconto(this.pontosParaUsar + 1) <= this.consultaSelecionada!.valor) {
      this.pontosParaUsar++;
    }
  }
  
  decrementarPontos(): void {
    if (this.pontosParaUsar > 0) {
      this.pontosParaUsar--;
    }
  }
  
  prosseguirParaConfirmacao(): void {
    this.etapaAtual = 'confirmacao';
  }
  
  voltarParaBusca(): void {
    this.etapaAtual = 'busca';
    this.consultaSelecionada = null;
  }
  
  voltarParaSelecao(): void {
    this.etapaAtual = 'selecao';
  }
  
  confirmarAgendamento(): void {
    if (!this.consultaSelecionada) return;
    
    this.enviandoAgendamento = true;
    this.consultaService.agendarConsulta(this.consultaSelecionada.codigo, this.pontosParaUsar).subscribe({
      next: (agendamento) => {
        this.sucesso = 'Agendamento realizado com sucesso!';
        this.etapaAtual = 'finalizado';
        this.enviandoAgendamento = false;
        
        // Atualizar saldo de pontos
        this.carregarSaldoPontos();
      },
      error: (erro) => {
        console.error('Erro ao agendar consulta:', erro);
        this.erro = 'Não foi possível completar o agendamento. Tente novamente.';
        this.enviandoAgendamento = false;
      }
    });
  }
  
  voltarParaInicio(): void {
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
  
  formatarMoeda(valor: number): string {
    return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  }
  
  getNomeEspecialidade(codigo: string): string {
    const especialidade = this.especialidades.find(e => e.codigo === codigo);
    return especialidade ? especialidade.nome : codigo;
  }
}