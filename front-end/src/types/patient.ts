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
