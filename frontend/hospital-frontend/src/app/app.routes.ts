import { Routes } from '@angular/router';
import { PacienteLayoutComponent } from './features/paciente/paciente-layout/paciente-layout.component';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  // Rota raiz
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  
  // Rotas de autenticação
  { 
    path: 'login', 
    loadComponent: () => import('./features/auth/login/login.component').then(m => m.LoginComponent) 
  },
  { 
    path: 'register', 
    loadComponent: () => import('./features/auth/register/register.component').then(m => m.RegisterComponent) 
  },
  
  // Rotas de paciente com layout
  { 
    path: 'paciente',
    component: PacienteLayoutComponent, 
    canActivate: [authGuard],
    children: [
      { 
        path: 'home', 
        loadComponent: () => import('./features/paciente/home/home.component').then(m => m.HomeComponent) 
      },
      { 
        path: 'pontos/comprar', 
        loadComponent: () => import('./features/paciente/pontos/comprar-pontos/comprar-pontos.component').then(m => m.ComprarPontosComponent) 
      },
      { 
        path: 'pontos/extrato', 
        loadComponent: () => import('./features/paciente/pontos/extrato-pontos/extrato-pontos.component').then(m => m.ExtratoPontosComponent) 
      },
      { 
        path: 'agendar', 
        loadComponent: () => import('./features/paciente/agendar/agendar-consulta.component').then(m => m.AgendarConsultaComponent) 
      },
      { 
        path: 'cancelar/:id', 
        loadComponent: () => import('./features/paciente/cancelar/cancelar-agendamento.component').then(m => m.CancelarAgendamentoComponent) 
      },
      { 
        path: 'agendamento/:id', 
        loadComponent: () => import('./features/paciente/agendamento/agendamento-detalhes.component').then(m => m.AgendamentoDetalhesComponent) 
      },
      { 
        path: 'check-in', 
        loadComponent: () => import('./features/paciente/check-in/check-in.component').then(m => m.CheckInComponent) 
      },
      { 
        path: 'check-in/:id', 
        loadComponent: () => import('./features/paciente/check-in/check-in.component').then(m => m.CheckInComponent) 
      },
      // Rota padrão para paciente
      { path: '', redirectTo: 'home', pathMatch: 'full' }
    ]
  },
  
  // Rotas de funcionário
  { 
    path: 'funcionario', 
    loadComponent: () => import('./features/funcionario/home/home.component').then(m => m.HomeComponent),
    canActivate: [authGuard]
  },
  {
    path: 'funcionario/consultas/nova',
    loadComponent: () => import('./features/funcionario/cadastro-consulta/cadastro-consulta.component').then(m => m.CadastroConsultaComponent),
    canActivate: [authGuard]
  },
  {
    path: 'funcionario/funcionarios',
    loadComponent: () => import('./features/funcionario/gerenciar-funcionarios/gerenciar-funcionarios.component').then(m => m.GerenciarFuncionariosComponent),
    canActivate: [authGuard]
  },
  
  // Rota para página não encontrada
  { path: '**', redirectTo: '/login' }
];