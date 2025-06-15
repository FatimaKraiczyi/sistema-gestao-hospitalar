import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../core/auth/auth.service';
import { PacienteService } from '../../../core/services/paciente.service';
import { ConsultaService } from '../../../core/services/consulta.service';
import { User } from '../../../models/user.model';


@Component({
  selector: 'app-paciente-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  currentUser: User | null = null;
  pacienteInfo: any = null;
  agendamentos: any[] = [];
  saldoPontos: number = 0;
  carregandoPontos: boolean = true;
  carregandoAgendamentos: boolean = true;
  erroCarregamento: string = '';

  constructor(
    private authService: AuthService,
    private pacienteService: PacienteService,
    private consultaService: ConsultaService
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    this.carregarDados();
  }

  carregarDados(): void {
    // Buscar informações do paciente (incluindo pontos)
    this.pacienteService.getPacienteInfo().subscribe(data => {
      this.pacienteInfo = data;
    });

    // Buscar histórico de agendamentos
    this.consultaService.getAgendamentos().subscribe(data => {
      this.agendamentos = data;
    });
  }

  get agendamentosFuturos() {
    return this.agendamentos.filter(a => ['CRIADO', 'CHECK-IN'].includes(a.status));
  }

  get agendamentosRealizados() {
    return this.agendamentos.filter(a => a.status === 'REALIZADO');
  }

  get agendamentosCancelados() {
    return this.agendamentos.filter(a => ['CANCELADO', 'FALTOU'].includes(a.status));
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'CRIADO': return 'badge bg-primary';
      case 'CHECK-IN': return 'badge bg-info';
      case 'COMPARECEU': return 'badge bg-info';
      case 'REALIZADO': return 'badge bg-success';
      case 'FALTOU': return 'badge bg-danger';
      case 'CANCELADO': return 'badge bg-warning';
      default: return 'badge bg-secondary';
    }
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