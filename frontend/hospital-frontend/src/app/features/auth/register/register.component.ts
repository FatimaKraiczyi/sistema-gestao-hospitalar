import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { NgxMaskDirective } from 'ngx-mask';
import { AuthService } from '../../../core/auth/auth.service';
import { ApiService } from '../../../core/http/api.service';

interface ViaCepResponse {
  logradouro: string;
  bairro: string;
  localidade: string;
  uf: string;
  erro?: boolean;
}

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    NgxMaskDirective, 
  ],
  templateUrl: './register.component.html',
})
export class RegisterComponent {
  registerForm: FormGroup;
  loading = false;
  submitted = false;
  error = '';
  success = '';
  
  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private apiService: ApiService
  ) {
    this.registerForm = this.formBuilder.group({
      cpf: ['', [Validators.required, Validators.pattern(/^\d{11}$/)]],
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      cep: ['', [Validators.required, Validators.pattern(/^\d{5}-?\d{3}$/)]],
      logradouro: [{ value: '', disabled: true }],
      bairro: [{ value: '', disabled: true }],
      cidade: [{ value: '', disabled: true }],
      estado: [{ value: '', disabled: true }],
      numero: ['', Validators.required],
      complemento: ['']
    });
  }

  // Getter para acesso fácil aos campos do formulário
  get f() { return this.registerForm.controls; }

  // Busca endereço pelo CEP usando a API ViaCEP
  buscarEnderecoPorCep(): void {
    const cep = this.f['cep'].value.replace(/\D/g, '');
    if (cep && cep.length === 8) {
      this.loading = true;
      this.error = '';
      this.apiService.get<ViaCepResponse>(`/paciente/cep/${cep}`)
        .subscribe({
          next: (data) => {
            console.log('Dados do CEP recebidos:', data);

            if (data && !data.erro) {
              this.registerForm.patchValue({
                logradouro: data.logradouro,
                bairro: data.bairro,
                cidade: data.localidade, 
                estado: data.uf, 
              });
              this.success = 'Endereço encontrado!';
            } else {
              this.error = 'CEP não encontrado.';
              this.limparCamposEndereco();
            }
            this.loading = false;
          },
          error: () => {
            this.error = 'Erro ao buscar o CEP. Tente novamente.';
            this.limparCamposEndereco();
            this.loading = false;
          }
        });
    }
  }

  limparCamposEndereco(): void {
      this.registerForm.patchValue({
        logradouro: '',
        bairro: '',
        cidade: '',
        estado: '',
      });
  }

  onSubmit(): void {
    this.submitted = true;
    
    // Para se o formulário for inválido
    if (this.registerForm.invalid) {
      this.error = "Por favor, preencha todos os campos obrigatórios."
      return;
    }
    
    this.loading = true;
    this.error = '';
    this.success = '';

    const rawValues = this.registerForm.getRawValue();

   this.authService.register({
      cpf: rawValues.cpf.replace(/\D/g, ''),
      name: rawValues.name,
      email: rawValues.email,
      cep: rawValues.cep.replace(/\D/g, ''),
      numero: rawValues.numero,
      complemento: rawValues.complemento
    })
    .subscribe({
      next: (response: any) => {
        this.success = response.message || 'Cadastro realizado com sucesso! Uma senha foi enviada para seu email.';
        this.loading = false;
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 3000);
      },
      error: error => {
        this.error = error.error?.message || 'Erro desconhecido ao cadastrar. Tente novamente.';
        this.loading = false;
      }
    });
  }
}