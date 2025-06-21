import axiosConfig from "../axiosConfig";

const prefix = "/auth";

/** Login do usuário */
export const login = async (email: string, password: string) => {
  return axiosConfig.post(`${prefix}/login`, { email, password });
};

/** Cadastro do usuário (com type fixo ou opcional) */
export const signUp = async (cpf: string, email: string, type = "PACIENTE") => {
  return axiosConfig.post(`${prefix}/register`, { cpf, email, type });
};

/** Esqueci minha senha */
export const resetPassword = async (email: string) => {
  return axiosConfig.post(`${prefix}/forgot-password`, { email });
};
