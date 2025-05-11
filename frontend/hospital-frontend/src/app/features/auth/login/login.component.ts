import { Component } from '@angular/core';
import { CommonModule } from '@angular/common'; // Para ngIf, ngClass, etc.
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms'; // Para formulários
import { Router, RouterLink } from '@angular/router'; // Para navegação
import { AuthService } from '../../../core/auth/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink
  ],
  templateUrl: './login.component.html',
})
export class LoginComponent {
  loginForm: FormGroup;
  loading = false;
  submitted = false;
  error = '';
  
  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private authService: AuthService
  ) {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  // Getter para acesso fácil aos campos do formulário
  get f() { return this.loginForm.controls; }

  onSubmit(): void {
    this.submitted = true;

    // Para se o formulário for inválido
    if (this.loginForm.invalid) {
      return;
    }

    this.loading = true;
    this.authService.login(this.f['email'].value, this.f['password'].value)
      .subscribe({
        next: () => {
          const role = this.authService.getUserRole();
          if (role === 'PACIENTE') {
            this.router.navigate(['/paciente']);
          } else if (role === 'FUNCIONARIO') {
            this.router.navigate(['/funcionario']);
          } else {
            this.router.navigate(['/']);
          }
        },
        error: error => {
          this.error = 'Email ou senha inválidos';
          this.loading = false;
        }
      });
  }
}