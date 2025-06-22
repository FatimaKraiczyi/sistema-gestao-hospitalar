import React, { useState, useEffect } from "react";
import { Container, Grid, Box, IconButton, Alert } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import LockIcon from "@mui/icons-material/Lock";
import Button from "@mui/material/Button";
import { useLocation, useNavigate } from "react-router";
import CreditCardIcon from "@mui/icons-material/CreditCard"; // Importa ícone para conta bancária

// Importação dos componentes usados no perfil
import { PersonalInfoSection } from "../../components/profile/PersonalInfoSection";
import { EditProfileModal } from "../../components/profile/EditProfileModal";
// Importação de serviços e hooks do Redux
import { completeInfo } from "../../services/authenticate/paciente_service";
import { useSelector } from "react-redux";
import { ROUTING } from "../../constants/routing";
import { RootState } from "../../stores/store";

// Tipagem para os dados do paciente
export interface PatientData {
  id?: string;
  cpf?: string;
  email?: string;
  nome: string;
  sobrenome?: string;
  telefone: string;
  logradouro?: string;
  numero: string;
  complemento?: string;
  bairro?: string;
  cidade?: string;
  estado?: string;
  cep: string;
  pontos?: number;
}

// Componente da página de perfil do paciente
const PatientProfilePage: React.FC = () => {
  // Busca o usuário logado do Redux
  const userData = useSelector((state: RootState) => state.user.user);
  // Declaração dos states necessários
  const [patientData, setPatientData] = useState<PatientData | null>(null); // Armazena informações do paciente
  const [isEditModalOpen, setIsEditModalOpen] = useState(false); // Estado de exibição do modal de edição
  const location = useLocation();
  const navigate = useNavigate(); // Hook de navegação
  const [isCompletingProfile, setIsCompletingProfile] = useState(false); // novo estado

  useEffect(() => {
    if (location.state?.openModal) {
      setIsEditModalOpen(true);
      setIsCompletingProfile(true); // flag ativada para completar
    }
  }, [location.state]);

  // Funções de controle dos modais - não chamam API
  // Abre modal de edição
  const handleOpenEditModal = () => {
    setIsEditModalOpen(true);
  };

  // Fecha modal de edição
  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
  };

  // Atualiza o state local e garante atualização do Redux
  const handleSaveProfile = async (updatedData: Partial<PatientData>) => {
    const updatedPatientData = {
      ...patientData,
      ...updatedData,
    };

    setPatientData(updatedPatientData);

    try {
      const nome = `${updatedData.nome || ""} ${
        updatedData.sobrenome || ""
      }`.trim();
      const telefone = updatedPatientData.telefone || "";
      const cep = updatedPatientData.cep || "";
      const numero = updatedPatientData.numero || "";
      const complemento = updatedPatientData.complemento || "";

      await completeInfo(
        userData?.id || "",
        userData?.cpf || "",
        userData?.email || updatedPatientData.email || "",
        { nome, telefone, cep, numero, complemento }
      );
    } catch (err) {
      console.error("Erro ao completar cadastro:", err);
    }
  };

  // Exibe estado de carregamento
  if (!userData) {
    return <div>Carregando...</div>;
  }

  /* 
  // Exibe mensagem de erro, se houver
  if (error) {
    return <Alert severity="error">{error}</Alert>;
  } */

  // Exibe mensagem caso não haja dados
  if (!userData) {
    return <Alert severity="info">Sem dados disponíveis</Alert>;
  }

  // Renderiza interface principal quando há dados
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Grid container spacing={3}>
        {/* Seção de informações pessoais */}
        <Grid item xs={12}>
          <Box sx={{ position: "relative" }}>
            <PersonalInfoSection
              firstName={userData.nome?.split(" ")[0] || "Não informado"}
              lastName={userData.nome?.split(" ").slice(1).join(" ") || ""}
              email={userData.email || "Não informado"}
              phone={userData.telefone || "Não informado"}
            />

            {/* Botão para editar informações */}
            <IconButton
              color="primary"
              onClick={handleOpenEditModal}
              sx={{
                position: "absolute",
                top: "12px",
                right: "12px",
                bgcolor: "background.paper",
                "&:hover": {
                  bgcolor: "action.hover",
                },
                boxShadow: 1,
                zIndex: 1,
              }}
              aria-label="Editar"
              size="small"
            >
              <EditIcon />
            </IconButton>
          </Box>
        </Grid>

        {/* Seção de botões de ação */}
        <Grid item xs={12}>
          <Box
            sx={{ display: "flex", justifyContent: "flex-end", gap: 2, mt: 2 }}
          >
            {/* Botão para trocar senha */}
            <Button
              variant="outlined"
              startIcon={<LockIcon />}
              onClick={() => navigate(ROUTING.CHANGE_PASSWORD)}
            >
              Trocar senha
            </Button>

            {/* Botão para gerenciar conta bancária */}
            <Button
              variant="outlined"
              startIcon={<CreditCardIcon />}
              onClick={() => navigate(`../${ROUTING.BANK_ACCOUNT}`)}
            >
              Conta bancária
            </Button>
          </Box>
        </Grid>
      </Grid>

      {/* Modal de edição de informações pessoais */}
      <EditProfileModal
        open={isEditModalOpen}
        onClose={handleCloseEditModal}
        onSave={handleSaveProfile}
        isCompleting={isCompletingProfile} // novo prop
        userData={{
          nome: userData.nome?.split(" ")[0] || "",
          sobrenome: userData.nome?.split(" ").slice(1).join(" ") || "",
          cpf: userData.cpf || "",
          email: userData.email || "",
          telefone: userData.telefone || "",
          cep: userData.cep || "",
          numero: userData.numero || "",
          complemento: userData.complemento || "",
          bairro: userData.bairro || "",
          cidade: userData.cidade || "",
          estado: userData.estado || "",
          logradouro: userData.logradouro || "",
        }}
      />
    </Container>
  );
};

export default PatientProfilePage;
