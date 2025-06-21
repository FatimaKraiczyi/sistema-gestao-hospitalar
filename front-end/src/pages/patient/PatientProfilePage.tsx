// Importação das bibliotecas React e componentes UI
import React, { useState, useEffect } from "react";
import { Container, Grid, Box, IconButton, Alert } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import LockIcon from "@mui/icons-material/Lock";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router";
import CreditCardIcon from "@mui/icons-material/CreditCard"; // Importa ícone para conta bancária

// Importação dos componentes usados no perfil
import { PersonalInfoSection } from "../../components/profile/PersonalInfoSection";
import { EditProfileModal } from "../../components/profile/EditProfileModal";
import AvatarUploadModal from "../../components/profile/AvatarUploadModal";
// Importação de serviços e hooks do Redux
import {
  completeInfo,
  getPatientInfo,
  updatePatientAvatar,
} from "../../services/authenticate/user_service";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "../../stores/slices/user.slice";
import { ROUTING } from "../../constants/routing";

// Tipagem para endereço do paciente
export interface Address {
  logradouro: string;
  numero: string;
  complemento?: string;
  bairro: string;
  cidade: string;
  estado: string;
  cep: string;
}

// Tipagem para os dados do paciente
export interface PatientData {
  id?: string;
  cpf?: string;
  email?: string;
  nome?: string;
  sobrenome?: string;
  telefone?: string;
  address: Address;
  pontos?: number;
  avatar?: string;
}

// Tipagem para o usuário do Redux
interface UserRedux {
  id: string;
  nome?: string;
  sobrenome?: string;
  email?: string;
  telefone?: string;
  avatar?: string;
  pontos?: number;
  // Adicione outros campos conforme necessário
}

// Componente da página de perfil do paciente
const PatientProfilePage: React.FC = () => {
  // Declaração dos states necessários
  const [patientData, setPatientData] = useState<PatientData | null>(null); // Armazena informações do paciente
  const [loading, setLoading] = useState(true); // Estado de carregamento
  const [error, setError] = useState<string | null>(null); // Armazena mensagem de erro, se houver
  const [isEditModalOpen, setIsEditModalOpen] = useState(false); // Estado de exibição do modal de edição
  const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false); // Estado de exibição do modal de upload de avatar
  const [avatarLoading, setAvatarLoading] = useState(false); // Estado de carregamento ao atualizar avatar
  const [avatarError, setAvatarError] = useState<string | null>(null); // Erro ao atualizar avatar
  const user = useSelector((state: { user: UserRedux }) => state.user); // Obtém informações do usuário do Redux
  const dispatch = useDispatch(); // Hook para disparar actions do Redux
  const navigate = useNavigate(); // Hook de navegação

  useEffect(() => {
    // Função para buscar dados do paciente para exibição
    const fetchPatientData = async () => {
      setLoading(true);
      try {
        // Chama API para obter informações do paciente pelo userId
        const response = await getPatientInfo(user.id);

        if (response.data && response.data.code === 200) {
          setPatientData(response.data.data);
          // Se o paciente não tiver nome, telefone, cep, numero, complemento, redireciona para edição obrigatória
          const d = response.data.data;
          if (!d.nome || !d.telefone || !d.address?.cep || !d.address?.numero) {
            setIsEditModalOpen(true);
          }
        } else {
          setError("Falha ao obter dados do paciente");
        }
      } catch (error) {
        console.error("Erro ao buscar dados do paciente:", error);
        setError(
          "Erro ao carregar dados do paciente. Tente novamente mais tarde."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchPatientData();
  }, [user.id]);

  // Funções de controle dos modais - não chamam API
  // Abre modal de edição
  const handleOpenEditModal = () => {
    setIsEditModalOpen(true);
  };

  // Fecha modal de edição
  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
  };

  // Abre modal de upload de avatar
  const handleOpenAvatarModal = () => {
    setIsAvatarModalOpen(true);
  };

  // Fecha modal de upload de avatar
  const handleCloseAvatarModal = () => {
    setIsAvatarModalOpen(false);
  };

  // Atualiza o state local e garante atualização do Redux
  const handleSaveProfile = async (updatedData: Partial<PatientData>) => {
    // Atualiza o state local para exibição imediata
    const updatedPatientData = {
      ...patientData!,
      ...updatedData,
    };
    setPatientData(updatedPatientData);

    // Chamada para completar cadastro no backend se for o primeiro cadastro
    if (
      !patientData?.nome ||
      !patientData?.telefone ||
      !patientData?.address?.cep ||
      !patientData?.address?.numero
    ) {
      try {
        const nome = `${updatedData.nome || ""} ${
          updatedData.sobrenome || ""
        }`.trim();
        const telefone = updatedPatientData.telefone || "";
        const cep = updatedPatientData.address?.cep || "";
        const numero = updatedPatientData.address?.numero || "";
        const complemento = updatedPatientData.address?.complemento || "";

        // Envia para o backend
        await completeInfo(
          user.id,
          patientData?.cpf || "",
          patientData?.email || updatedPatientData.email || "",
          {
            nome,
            telefone,
            cep,
            numero,
            complemento,
          }
        );
      } catch {
        // Trate o erro se necessário
      }
    }
  };

  // Atualiza avatar usando API
  const handleSaveAvatar = async (newAvatar: string) => {
    try {
      setAvatarLoading(true);
      setAvatarError(null);
      // Chama API para atualizar avatar
      const response = await updatePatientAvatar(user.id, {
        uri: newAvatar,
      });
      if (response?.data?.code === 200) {
        // Atualiza state local com dados retornados da API
        setPatientData(response.data.data);
        // Atualiza Redux
        const updatedUser = {
          ...user,
          avatar: response.data.data.avatar,
        };
        dispatch(setUser(updatedUser));
        console.log(
          "Avatar atualizado com sucesso:",
          response.data.data.avatar
        );
      } else {
        throw new Error("Falha ao atualizar avatar");
      }
    } catch (error) {
      console.error("Erro ao atualizar avatar:", error);
      setAvatarError("Falha ao atualizar avatar. Tente novamente.");
    } finally {
      setAvatarLoading(false);
    }
  };

  // Exibe estado de carregamento
  if (loading) {
    return <div>Carregando...</div>;
  }

  // Exibe mensagem de erro, se houver
  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  // Exibe mensagem caso não haja dados
  if (!patientData) {
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
              firstName={patientData.nome?.split(" ")[0] || "Não informado"}
              lastName={patientData.nome?.split(" ").slice(1).join(" ") || ""}
              email={patientData.email || "Não informado"}
              phone={patientData.telefone || "Não informado"}
              address={patientData.address as unknown as Address}
              avatar={patientData.avatar || "/default-avatar.png"}
              onEditAvatar={handleOpenAvatarModal}
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
        userData={{
          firstName: patientData.nome?.split(" ")[0] || "",
          lastName: patientData.nome?.split(" ").slice(1).join(" ") || "",
          email: patientData.email || "",
          phone: patientData.telefone || "",
          address: patientData.address as unknown as Address,
        }}
      />

      {/* Modal de upload de avatar */}
      <AvatarUploadModal
        open={isAvatarModalOpen}
        currentAvatar={patientData.avatar || "/default-avatar.png"}
        onClose={handleCloseAvatarModal}
        onSave={handleSaveAvatar}
        isLoading={avatarLoading}
        error={avatarError}
      />
    </Container>
  );
};

export default PatientProfilePage;
