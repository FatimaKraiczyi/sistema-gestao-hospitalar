import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PacienteService } from '../../../../core/services/paciente.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-comprar-pontos',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './comprar-pontos.component.html',
  styleUrls: ['./comprar-pontos.component.css']
})
export class ComprarPontosComponent implements OnInit {
  pontoForm: FormGroup;
  valorTotal: number = 0;
  valorUnitario: number = 5; 
  enviando: boolean = false;
  erro: string = '';
  sucesso: string = '';

  constructor(
    private fb: FormBuilder,
    private pacienteService: PacienteService,
    private router: Router
  ) {
    this.pontoForm = this.fb.group({
      quantidade: [10, [Validators.required, Validators.min(1)]]
    });
  }

  ngOnInit(): void {
    this.pontoForm.get('quantidade')?.valueChanges.subscribe(val => {
      this.valorTotal = (val || 0) * this.valorUnitario;
    });
    this.valorTotal = (this.pontoForm.get('quantidade')?.value || 0) * this.valorUnitario;
  }

  onSubmit(): void {
    if (this.pontoForm.invalid) {
      this.erro = 'Por favor, insira uma quantidade válida.';
      return;
    }

    this.enviando = true;
    this.erro = '';
    this.sucesso = '';
    
    const quantidadeParaComprar = this.pontoForm.get('quantidade')?.value || 0;

    this.pacienteService.comprarPontos(quantidadeParaComprar).subscribe({
      next: () => {
        this.sucesso = `${quantidadeParaComprar} pontos comprados com sucesso!`;
        this.enviando = false;
        setTimeout(() => this.router.navigate(['/paciente/home']), 2000);
      },
      error: (err) => {
        this.erro = 'Falha ao processar a compra. Tente novamente.';
        this.enviando = false;
        console.error(err);
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