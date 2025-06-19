import { Diploma } from "../../types";
import axiosConfig from "../axiosConfig";

const prefix = "/admin/api/v1/doctors";

export const getAllDoctors = async () => {
  const response = await axiosConfig.get(`${prefix}`);
  return response.data;
};

export const addDoctor = async (doctor: any) => {
  const response = await axiosConfig.post(`${prefix}`, doctor);
  return response.data;
};

export const importDoctor = async (doctors: any) => {
  const response = await axiosConfig.post(`${prefix}/import`, doctors);
  return response.data;
};

// API para adicionar e atualizar certificados do médico
// Se certId for diferente de 0 é atualização, se não existe é adição
export const updateAddCertificate = async (
  doctorId: string, // userId do médico
  certificate: {
    certName: string;
    issueDate: string; // dd-mm-yyyy
  },
  certId?: string
) => {
  const { certName, issueDate } = certificate;

  console.log("Chamar API para adicionar/atualizar certificado:", {
    doctorId,
    certId,
    requestBody: { certName, issueDate },
  });

  const response = await axiosConfig.put(
    `${prefix}/certification/update/${doctorId}/${certId}`,
    { certName, issueDate }
  );

  console.log("Resultado da API de certificado:", response.data);
  return response.data;
};

// API para adicionar e atualizar experiência do médico
// Se experienceId for diferente de 0 é atualização, se não existe é adição
export const updateAddExperience = async (
  doctorId: string, // userId do médico
  experience: {
    companyName: string;
    specialization: string;
    startDate: string; // dd-mm-yyyy
    endDate: string; // dd-mm-yyyy
    address: {
      number: string;
      street: string;
      ward: string;
      district: string;
      city: string;
      country: string;
    };
    description: string;
  },
  experienceId?: string
) => {
  const {
    companyName,
    specialization,
    startDate,
    endDate,
    address,
    description,
  } = experience;

  const { number, street, ward, district, city, country } = address;

  const requestBody = {
    companyName,
    specialization,
    startDate,
    endDate,
    address: { number, street, ward, district, city, country },
    description,
  };

  console.log("Chamar API para adicionar/atualizar experiência:", {
    doctorId,
    experienceId,
    requestBody,
  });

  const response = await axiosConfig.put(
    `${prefix}/experience/update/${doctorId}/${experienceId}`,
    requestBody
  );

  console.log("Resultado da API de experiência:", response.data);
  return response.data;
};

// API para adicionar e atualizar informações acadêmicas do médico
// Se educationId for diferente de 0 é atualização, se não existe é adição
export const updateAddEducation = async (
  doctorId: string, // userId do médico
  education: {
    schoolName: string;
    joinDate: string; // dd-mm-yyyy
    graduateDate: string; // dd-mm-yyyy
    diploma: keyof typeof Diploma; // "BACHELOR", "MASTER", "DOCTOR", "PROFESSOR"
  },
  educationId?: string
) => {
  const { schoolName, joinDate, graduateDate, diploma } = education;

  const requestBody = { schoolName, joinDate, graduateDate, diploma };

  console.log("Chamar API para adicionar/atualizar formação acadêmica:", {
    doctorId,
    educationId,
    requestBody,
  });

  const response = await axiosConfig.put(
    `${prefix}/education/update/${doctorId}/${educationId}`,
    requestBody
  );

  console.log("Resultado da API de formação acadêmica:", response.data);
  return response.data;
};

// Exclusão na verdade é alteração do status do médico
export const deleteDoctor = async (doctorId: string) => {
  const response = await axiosConfig.delete(`${prefix}`, {
    params: {
      doctorId: doctorId,
    },
  });
  return response.data;
};
