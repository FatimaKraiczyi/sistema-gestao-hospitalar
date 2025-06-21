export interface User {
  id: string;
  cpf: string;
  email: string;
  senha: string;
  type?: string; // "patient", "doctor", "admin", etc.
}

// O admin não é muito diferente do User
export type Admin = User;
