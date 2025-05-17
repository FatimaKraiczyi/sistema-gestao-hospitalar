import { Injectable } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../auth/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  
  if (authService.isAuthenticated()) {
    const requiredRole = route.data['role'] as string;
    
    // Se a rota exige um papel específico, verificar
    if (requiredRole && authService.getUserRole() !== requiredRole) {
      router.navigate(['/login']);
      return false;
    }
    
    return true;
  }
  
  // Redirecionar para login
  router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
  return false;
};