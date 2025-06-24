export interface ConsultaModel {
  codigo: string;
  especialidade: string;
  medico: string;
  status: string;
  data: string; // ISO string (LocalDateTime)
  vagasDisponiveis: number;
  // Adicione outros campos conforme necessário
}

export interface AgendamentoModel {
  id: string;
  codigoConsulta: string;
  codigoPaciente: string;
  data: string; // ISO string (LocalDateTime)
  especialidade: string;
  medico: string;
  valor: number;
  pontosUsados: number;
  valorPago: number;
  status: string;
}
