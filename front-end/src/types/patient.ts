import { User } from "./user";
import { Appointment } from "./appointment";
import { MedicalRecord } from "./medical";

export interface PacienteRequest {
  nome: string;
  telefone: string;
  cep: string;
  numero: string;
  complemento?: string;
}
export interface Patient extends User {
  info?: PacienteRequest; // Based on the stay relationship (1 - 1..*)
  medicalRecords?: MedicalRecord[]; // Based on the register relationship (1 - 0..*)
  appointments?: Appointment[]; // Based on the have relationship (1 - 0..*)
}

export interface PatientResponse {
  id: string;
  cpf: string;
  email: string;
  nome: string;
  telefone: string;
  cep: string;
  logradouro: string;
  numero: string;
  complemento?: string;
  bairro: string;
  cidade: string;
  estado: string;
  pontos: number;
}
