import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../core/auth/auth.service';

@Component({
  selector: 'app-funcionario-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './home.component.html',
  styles: []
})
export class HomeComponent {
  constructor(private authService: AuthService) {}
  
  logout(): void {
    this.authService.logout();
    window.location.href = '/login';
  }
}