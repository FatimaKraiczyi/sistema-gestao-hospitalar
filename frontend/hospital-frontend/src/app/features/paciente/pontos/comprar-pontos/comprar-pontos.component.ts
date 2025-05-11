import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { PacienteService } from '../../../../core/services/paciente.service';

@Component({
  selector: 'app-comprar-pontos',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './comprar-pontos.component.html',
  styleUrls: ['./comprar-pontos.component.css']
})
export class ComprarPontosComponent {
  pontoForm: FormGroup;
  valorUnitario: number = 5.00; // 1 ponto = R$ 5,00
  valorTotal: number = 0;
  enviando: boolean = false;
  sucesso: string = '';
  erro: string = '';
  
  constructor(
    private fb: FormBuilder,
    private pacienteService: PacienteService,
    private router: Router
  ) {
    this.pontoForm = this.fb.group({
      quantidade: [10, [Validators.required, Validators.min(1), Validators.max(1000)]]
    });
    
    // Atualizar valor total quando a quantidade mudar
    this.pontoForm.get('quantidade')?.valueChanges.subscribe(quantidade => {
      this.valorTotal = quantidade * this.valorUnitario;
    });
    
    // Inicializar valor total
    this.valorTotal = this.pontoForm.get('quantidade')?.value * this.valorUnitario;
  }
  
  onSubmit() {
    if (this.pontoForm.invalid) {
      return;
    }
    
    this.enviando = true;
    const quantidade = this.pontoForm.get('quantidade')?.value;
    
    this.pacienteService.comprarPontos(quantidade).subscribe({
      next: (transacao) => {
        this.sucesso = `Compra realizada com sucesso! Você adquiriu ${quantidade} pontos.`;
        this.enviando = false;
        
        // Redirecionar após 2 segundos
        setTimeout(() => {
          this.router.navigate(['/paciente/pontos/extrato']);
        }, 2000);
      },
      error: (erro) => {
        console.error('Erro ao comprar pontos:', erro);
        this.erro = 'Não foi possível completar a compra. Tente novamente.';
        this.enviando = false;
      }
    });
  }
  
  formatarMoeda(valor: number): string {
    return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  }

  voltar(): void {
    this.router.navigate(['/paciente/home']);
  }
}