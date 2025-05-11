import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { delay, map, tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { User } from '../../models/user.model';

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

  // Carrega o usuário do localStorage ao inicializar o serviço
  private loadUserFromStorage(): void {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decodedToken = this.parseJwt(token);
        const user: User = {
          id: decodedToken.id,
          name: decodedToken.name,
          email: decodedToken.sub || decodedToken.email,
          role: decodedToken.role
        };
        this.currentUserSubject.next(user);
      } catch (error) {
        localStorage.removeItem('token');
      }
    }
  }

  // Decodifica o token JWT
  private parseJwt(token: string): any {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(c => {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(jsonPayload);
  }

  // Login mockado para desenvolvimento
  login(email: string, password: string): Observable<boolean> {
    console.log('Login mockado para:', email);
    
    // Mock de usuários para teste
    const mockUsers = [
      { email: 'func_pre@hospital.com', password: 'TADS', role: 'FUNCIONARIO', name: 'Funcionário Padrão', id: '1' },
      { email: 'paciente@teste.com', password: '1234', role: 'PACIENTE', name: 'Paciente Teste', id: '2' }
    ];
    
    const user = mockUsers.find(u => u.email === email && u.password === password);
    
    if (user) {
      // Token JWT mock
      const mockToken = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIke3VzZXIuZW1haWx9IiwibmFtZSI6IiR7dXNlci5uYW1lfSIsInJvbGUiOiIke3VzZXIucm9sZX0iLCJpZCI6IiR7dXNlci5pZH0iLCJpYXQiOjE1MTYyMzkwMjJ9.signature`;
      
      // Armazena o token
      localStorage.setItem('token', mockToken);
      
      // Atualiza o usuário atual
      this.currentUserSubject.next({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      });
      
      return of(true).pipe(delay(800)); // Simula o tempo de resposta do servidor
    }
    
    return of(false).pipe(delay(800));
  }

  // Registro do paciente (autocadastro) mockado
  register(userData: {
    cpf: string,
    name: string,
    email: string,
    cep: string
  }): Observable<any> {
    console.log('Registro mockado para:', userData);
    return of({ success: true, message: 'Registro realizado com sucesso!' }).pipe(delay(1000));
  }

  // Logout
  logout(): void {
    localStorage.removeItem('token');
    this.currentUserSubject.next(null);
  }

  // Verifica se o usuário está autenticado
  isAuthenticated(): boolean {
    return this.currentUserSubject.value !== null;
  }

  // Retorna o papel/perfil do usuário (PACIENTE ou FUNCIONARIO)
  getUserRole(): string | null {
    const currentUser = this.currentUserSubject.value;
    return currentUser ? currentUser.role : null;
  }
}

  // // Login usando JWT
  // login(email: string, password: string): Observable<boolean> {
  //   return this.http.post<{ token: string }>(`${this.apiUrl}/auth/login`, { email, password })
  //     .pipe(
  //       tap(response => {
  //         if (response.token) {
  //           localStorage.setItem('token', response.token);
  //           const decodedToken = this.parseJwt(response.token);
  //           this.currentUserSubject.next({
  //             id: decodedToken.id,
  //             name: decodedToken.name,
  //             email: decodedToken.sub || decodedToken.email,
  //             role: decodedToken.role
  //           });
  //         }
  //       }),
  //       map(response => !!response.token)
  //     );
  // }

  // // Registro do paciente (autocadastro)
  // register(userData: {
  //   cpf: string,
  //   name: string,
  //   email: string,
  //   cep: string
  // }): Observable<any> {
  //   return this.http.post<any>(`${this.apiUrl}/auth/register`, userData);
  // }

  // // Logout
  // logout(): void {
  //   localStorage.removeItem('token');
  //   this.currentUserSubject.next(null);
  // }

  // // Verifica se o usuário está autenticado
  // isAuthenticated(): boolean {
  //   const token = localStorage.getItem('token');
  //   if (!token) return false;
    
  //   try {
  //     const decodedToken = this.parseJwt(token);
  //     const expirationDate = new Date(0);
  //     expirationDate.setUTCSeconds(decodedToken.exp);
  //     return expirationDate > new Date();
  //   } catch (error) {
  //     return false;
  //   }
  // }

  // // Retorna o papel/perfil do usuário (PACIENTE ou FUNCIONARIO)
  // getUserRole(): string | null {
  //   const currentUser = this.currentUserSubject.value;
  //   return currentUser ? currentUser.role : null;
  // }