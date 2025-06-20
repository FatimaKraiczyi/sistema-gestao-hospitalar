import axiosConfig from "../axiosConfig";

const prefix = "/paciente/api/v1/paciente";

export interface PacienteRequestDTO {
  nome: string;
  telefone: string;
  cep: string;
  numero: string;
  complemento?: string;
}

export const completarCadastroPaciente = async (
  id: string,
  cpf: string,
  email: string,
  data: PacienteRequestDTO
) => {
  // Ajuste a URL conforme o endpoint real do backend
  const response = await axiosConfig.post(
    `${prefix}/completar-cadastro`,
    data,
    {
      headers: {
        "X-User-Id": id,
        "X-User-Cpf": cpf,
        "X-User-Email": email,
      },
    }
  );
  return response;
};
