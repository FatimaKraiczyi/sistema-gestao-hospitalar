import { Component } from '@angular/core';
import { CommonModule } from '@angular/common'; // Para ngIf, ngClass, etc.
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms'; // Para formulários
import { Router, RouterLink } from '@angular/router'; // Para navegação
import { NgxMaskDirective, NgxMaskPipe } from 'ngx-mask'; // Importar ambos
import { AuthService } from '../../../core/auth/auth.service';
import { ApiService } from '../../../core/http/api.service';

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
      cep: ['', [Validators.required, Validators.pattern(/^\d{8}$/)]]
    });
  }

  // Getter para acesso fácil aos campos do formulário
  get f() { return this.registerForm.controls; }

  // Busca endereço pelo CEP usando a API ViaCEP
  buscarEnderecoPorCep(): void {
    const cep = this.f['cep'].value.replace(/\D/g, '');
    
    if (cep && cep.length === 8) {
      this.apiService.get<any>(`/viacep/${cep}`)
        .subscribe({
          next: (data) => {
            if (!data.erro) {
              // Mostra mensagem de sucesso ao encontrar o CEP
              this.success = 'Endereço encontrado com sucesso!';
              // Remove a mensagem após 3 segundos
              setTimeout(() => this.success = '', 3000);
            } else {
              this.error = 'CEP não encontrado';
            }
          },
          error: () => {
            this.error = 'Erro ao buscar endereço. Verifique o CEP.';
          }
        });
    }
  }

  onSubmit(): void {
    this.submitted = true;
    
    // Para se o formulário for inválido
    if (this.registerForm.invalid) {
      return;
    }
    
    this.loading = true;
    this.authService.register({
      cpf: this.f['cpf'].value.replace(/\D/g, ''),
      name: this.f['name'].value,
      email: this.f['email'].value,
      cep: this.f['cep'].value.replace(/\D/g, '')
    })
    .subscribe({
      next: () => {
        this.success = 'Cadastro realizado com sucesso! Uma senha foi enviada para seu email.';
        // Redireciona para a página de login após 3 segundos
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 3000);
      },
      error: error => {
        if (error.status === 409) {
          this.error = 'CPF ou e-mail já cadastrado';
        } else {
          this.error = 'Erro ao cadastrar. Tente novamente.';
        }
        this.loading = false;
      }
    });
  }
}