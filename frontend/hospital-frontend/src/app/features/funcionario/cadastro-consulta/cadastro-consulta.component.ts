import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { FuncionarioService, NovaConsulta } from '../../../core/services/funcionario.service';
import { ConsultaService } from '../../../core/services/consulta.service';

@Component({
  selector: 'app-cadastro-consulta',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './cadastro-consulta.component.html',
  styleUrls: ['./cadastro-consulta.component.css']
})
export class CadastroConsultaComponent implements OnInit {
  formulario: FormGroup;
  especialidades = [
    { codigo: 'CARD', nome: 'Cardiologia' },
    { codigo: 'DERM', nome: 'Dermatologia' },
    { codigo: 'PED', nome: 'Pediatria' },
    { codigo: 'GINE', nome: 'Ginecologia' },
    { codigo: 'ORTO', nome: 'Ortopedia' }
  ];
  
  medicos = [
    'Dr. Paulo Cardoso',
    'Dra. Lúcia Silva',
    'Dr. Carlos Santos',
    'Dra. Ana Costa',
    'Dr. Roberto Lima'
  ];

  salvando = false;
  mensagemSucesso = '';
  mensagemErro = '';

  constructor(
    private fb: FormBuilder,
    private funcionarioService: FuncionarioService,
    private router: Router
  ) {
    this.formulario = this.fb.group({
      data: ['', Validators.required],
      hora: ['', Validators.required],
      especialidade: ['', Validators.required],
      medico: ['', Validators.required],
      valor: ['', [Validators.required, Validators.min(1)]],
      vagas: ['', [Validators.required, Validators.min(1), Validators.max(20)]]
    });
  }

  ngOnInit(): void {
    // Definir data mínima como hoje
    const hoje = new Date();
    const dataMinima = hoje.toISOString().split('T')[0];
    this.formulario.patchValue({ data: dataMinima });
  }

  onSubmit(): void {
    if (this.formulario.valid) {
      this.salvando = true;

      // Combinar data e hora
      const dataForm = this.formulario.value.data;
      const horaForm = this.formulario.value.hora;
      const dataCompleta = new Date(`${dataForm}T${horaForm}`);

      const novaConsulta: NovaConsulta = {
        data: dataCompleta,
        especialidade: this.formulario.value.especialidade,
        medico: this.formulario.value.medico,
        valor: parseFloat(this.formulario.value.valor),
        vagas: parseInt(this.formulario.value.vagas)
      };

      this.funcionarioService.cadastrarConsulta(novaConsulta).subscribe({
        next: (consulta) => {
          this.mensagemSucesso = `Consulta ${consulta.codigo} cadastrada com sucesso!`;
          this.salvando = false;
          setTimeout(() => {
            this.router.navigate(['/funcionario']);
          }, 2000);
        },
        error: (erro) => {
          console.error('Erro ao cadastrar consulta:', erro);
          this.mensagemErro = 'Erro ao cadastrar consulta. Tente novamente.';
          this.salvando = false;
        }
      });
    } else {
      this.marcarCamposInvalidos();
    }
  }

  marcarCamposInvalidos(): void {
    Object.keys(this.formulario.controls).forEach(campo => {
      const controle = this.formulario.get(campo);
      if (controle) {
        controle.markAsTouched();
      }
    });
  }

  isInvalido(campo: string): boolean {
    const controle = this.formulario.get(campo);
    return !!(controle && controle.invalid && controle.touched);
  }

  getMensagemErro(campo: string): string {
    const controle = this.formulario.get(campo);
    if (controle && controle.errors && controle.touched) {
      if (controle.errors['required']) return `${campo} é obrigatório`;
      if (controle.errors['min']) return `${campo} deve ser maior que ${controle.errors['min'].min}`;
      if (controle.errors['max']) return `${campo} deve ser menor que ${controle.errors['max'].max}`;
    }
    return '';
  }

  cancelar(): void {
    this.router.navigate(['/funcionario']);
  }

  formatarValor(event: any): void {
    let valor = event.target.value.replace(/[^\d,]/g, '');
    if (valor) {
      const numero = parseFloat(valor.replace(',', '.'));
      if (!isNaN(numero)) {
        this.formulario.patchValue({ valor: numero });
      }
    }
  }
}