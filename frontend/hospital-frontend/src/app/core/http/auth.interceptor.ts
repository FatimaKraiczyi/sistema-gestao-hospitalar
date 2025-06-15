import { HttpErrorResponse, HttpHandlerFn, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

export const AuthInterceptor: HttpInterceptorFn = (req, next) => {
  console.log(`[AuthInterceptor] Interceptando a requisição para: ${req.url}`);
  
  const router = inject(Router);
  const token = localStorage.getItem('token');

  if (!token) {
    return next(req);
  }

  const clonedReq = req.clone({
    headers: req.headers.set('Authorization', `Bearer ${token}`),
  });

  return next(clonedReq).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        localStorage.removeItem('token');
        router.navigate(['/login']);
      }
      return throwError(() => error);
    })
  );
};