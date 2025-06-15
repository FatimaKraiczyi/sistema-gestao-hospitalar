import { HttpErrorResponse, HttpEvent, HttpHandlerFn, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

export const AuthInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
): Observable<HttpEvent<unknown>> => {
  
  const router = inject(Router);
  const token = localStorage.getItem('token');

  // Se não houver token, apenas continua a requisição
  if (!token) {
    return next(req);
  }

  // Se houver token, clona a requisição e adiciona o cabeçalho de autorização
  const clonedReq = req.clone({
    headers: req.headers.set('Authorization', `Bearer ${token}`),
  });

  // Envia a requisição clonada e trata possíveis erros
  return next(clonedReq).pipe(
    catchError((error: HttpErrorResponse) => {
      // Se o erro for 401 (Não Autorizado), desloga o usuário e o redireciona para a tela de login
      if (error.status === 401) {
        localStorage.removeItem('token');
        router.navigate(['/login']);
      }
      return throwError(() => error);
    })
  );
};