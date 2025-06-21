import axiosConfig from "../axiosConfig";

const prefix = "/paciente";
export const getPatientInfo = async (userId: string) => {
  const response = await axiosConfig.get(`${prefix}/patient`, {
    params: {
      userId: userId,
    },
  });
  return response;
};

/** Cadastro do usuário (com type fixo ou opcional) */
export const completeInfo = async (cpf: string, email: string) => {
  return axiosConfig.post(`${prefix}/completar`, { cpf, email });
};

export const getDoctorInfo = async (userId: string) => {
  const response = await axiosConfig.get(`${prefix}/doctor`, {
    params: {
      userId: userId,
    },
  });
  return response;
};

// Corrige tipagem do parâmetro data em updateInfo
export interface PatientUpdateInfo {
  // Adapte os campos conforme o backend espera
  name?: string;
  email?: string;
  phone?: string;
  // ...outros campos...
}

export const updateInfo = async (userId: string, data: PatientUpdateInfo) => {
  const response = await axiosConfig.put(`${prefix}/patient/${userId}`, data);
  return response.data;
};

export const addBankAccount = async (
  patientId: string,
  bankName: string,
  accountNumber: string
) => {
  const response = await axiosConfig.post(`${prefix}/patient/account_bank`, {
    patientId,
    bankName,
    accountNumber,
  });
  return response;
};

export const updateBankAccount = async (
  patientId: string,
  bankName: string,
  accountNumber: string
) => {
  const response = await axiosConfig.put(`${prefix}/patient/account_bank`, {
    patientId,
    bankName,
    accountNumber,
  });
  return response;
};

// Usado para checar e obter informações da conta bancária do paciente
// Se retornar code 200 em data, então o paciente possui conta bancária
export const getPatientBankAccount = async (patientId: string) => {
  const response = await axiosConfig.get(`${prefix}/patient/account_bank`, {
    params: {
      patientId: patientId,
    },
  });
  return response;
};

export const updatePatientAvatar = async (
  patientId: string,
  image: { uri: string; type?: string }
) => {
  const formData = new FormData();

  // Converte a string base64 em um arquivo Blob
  const fetchResponse = await fetch(image.uri);
  const blob = await fetchResponse.blob();

  // Cria um nome de arquivo a partir do timestamp para garantir unicidade
  const fileName = `avatar_${Date.now()}.jpg`;

  // Adiciona o arquivo ao FormData - esta é a parte mais importante
  // Certifique-se de que o nome seja 'file', conforme exigido pelo servidor
  formData.append("image", blob, fileName);
  formData.append("patientId", patientId);

  const response = await axiosConfig.put(`${prefix}/patient/avatar`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response;
};

export const updateDoctorAvatar = async (
  doctorId: string,
  image: { uri: string; type?: string }
) => {
  const formData = new FormData();
  // Converte a string base64 em um arquivo Blob
  const fetchResponse = await fetch(image.uri);
  const blob = await fetchResponse.blob();

  // Cria um nome de arquivo a partir do timestamp para garantir unicidade
  const fileName = `avatar_${Date.now()}.jpg`;

  // Adiciona o arquivo ao FormData - esta é a parte mais importante
  // Certifique-se de que o nome seja 'file', conforme exigido pelo servidor
  formData.append("image", blob, fileName);
  formData.append("doctorId", doctorId);
  const response = await axiosConfig.put(`${prefix}/doctor/avatar`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response;
};
