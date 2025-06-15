import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { User } from '../../models/user.model';

// Definição da interface para a resposta do login
interface AuthResponse {
  token: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = environment.apiUrl;
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {
    this.loadUserFromStorage();
  }

  // Decodifica o token JWT para extrair informações do usuário
  private parseJwt(token: string): any {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(atob(base64).split('').map(c => {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));
      return JSON.parse(jsonPayload);
    } catch (error) {
      console.error("Erro ao decodificar o token JWT:", error);
      return null;
    }
  }
  
  // Carrega o usuário do localStorage ao inicializar o serviço
  private loadUserFromStorage(): void {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decodedToken = this.parseJwt(token);
        if (decodedToken) {
          const user: User = {
            id: decodedToken.uuid,
            name: decodedToken.name,
            email: decodedToken.email,
            role: decodedToken.type
          };
          this.currentUserSubject.next(user);
        } else {
          localStorage.removeItem('token');
        }
      } catch (error) {
        console.error("Erro ao processar token do localStorage:", error);
        localStorage.removeItem('token');
      }
    }
  }

  // Login do usuário
  login(email: string, password: string): Observable<boolean> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, { email, password })
      .pipe(
        tap(response => {
          if (response && response.token) {
            localStorage.setItem('token', response.token);
            const decodedToken = this.parseJwt(response.token);
            if (decodedToken) {
              const user: User = {
                id: decodedToken.uuid,
                name: decodedToken.name || 'Usuário',
                email: decodedToken.email,
                role: decodedToken.type
              };
              this.currentUserSubject.next(user);
            }
          }
        }),
        map(response => !!(response && response.token)),
        catchError(error => {
          console.error('Falha no login:', error);
          return of(false);
        })
      );
  }

  // Registro de novo paciente
  register(userData: { 
    cpf: string, 
    name: string, 
    email: string, 
    cep: string, 
    numero: string,
    complemento: string
  }): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/register`, userData);
  }

  // Logout
  logout(): void {
    localStorage.removeItem('token');
    this.currentUserSubject.next(null);
  }

  // Verifica se o usuário está autenticado
  public isAuthenticated(): boolean {
    const token = localStorage.getItem('token');
    if (!token) {
      return false;
    }
  
    try {
      const decodedToken = this.parseJwt(token);
      if (!decodedToken || !decodedToken.exp) {
        return false;
      }
      const expirationDate = new Date(0);
      expirationDate.setUTCSeconds(decodedToken.exp);
      return expirationDate.valueOf() > new Date().valueOf();
    } catch (error) {
      return false;
    }
  }

  // Retorna o papel (role) do usuário
  public getUserRole(): string | null {
    return this.currentUserSubject.value?.role ?? null;
  }

  // Retorna o usuário atual
  public getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }
}