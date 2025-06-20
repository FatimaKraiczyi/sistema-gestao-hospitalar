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
  getPatientInfo,
  updatePatientAvatar,
} from "../../services/authenticate/user_service";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "../../stores/slices/user.slice";
import { ROUTING } from "../../constants/routing";
import { completarCadastroPaciente } from "../../services/paciente/cadastro_service";
import axios from "axios";

// Tipagem para endereço do paciente
export interface Address {
  street?: string;
  number?: string;
  complement?: string;
  neighborhood?: string;
  city?: string;
  state?: string;
  cep?: string;
  // Adicione outros campos conforme necessário
}

// Tipagem para os dados do paciente
export interface PatientData {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  dob?: string;
  sex?: string | null;
  address?: Address | null;
  avatar?: string;
  userId?: string;
  cpf?: string;
}

// Tipagem para o usuário do Redux
interface UserRedux {
  userId: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  avatar?: string;
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
  const user = useSelector(
    (state: { user: { user: UserRedux } }) => state.user.user
  ); // Obtém informações do usuário do Redux
  const dispatch = useDispatch(); // Hook para disparar actions do Redux
  const navigate = useNavigate(); // Hook de navegação

  useEffect(() => {
    // Função para buscar dados do paciente para exibição
    const fetchPatientData = async () => {
      setLoading(true);
      try {
        // Chama API para obter informações do paciente pelo userId
        const response = await getPatientInfo(user.userId);

        if (response.data && response.data.code === 200) {
          setPatientData(response.data.data);
          // Se o paciente não tiver nome, telefone, cep, numero, complemento, redireciona para edição obrigatória
          const d = response.data.data;
          if (
            !d.firstName ||
            !d.phone ||
            !d.address?.cep ||
            !d.address?.number
          ) {
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
  }, [user.userId]);

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
      address: updatedData.address || patientData?.address || null,
    };
    setPatientData(updatedPatientData);

    // Chamada para completar cadastro no backend se for o primeiro cadastro
    if (
      !patientData?.firstName ||
      !patientData?.phone ||
      !patientData?.address?.cep ||
      !patientData?.address?.number
    ) {
      try {
        // Concatena nome completo
        const nome = `${updatedPatientData.firstName || ""} ${
          updatedPatientData.lastName || ""
        }`.trim();
        const telefone = updatedPatientData.phone || "";
        const cep = updatedPatientData.address?.cep || "";
        const numero = updatedPatientData.address?.number || "";
        const complemento = updatedPatientData.address?.complement || "";

        // Busca dados do endereço pelo CEP
        let enderecoViaCep = {};
        if (cep.length === 8) {
          try {
            const res = await axios.get(
              `https://viacep.com.br/ws/${cep}/json/`
            );
            if (res.data && !res.data.erro) {
              enderecoViaCep = {
                street: res.data.logradouro,
                neighborhood: res.data.bairro,
                city: res.data.localidade,
                state: res.data.uf,
              };
            }
          } catch (err) {
            // erro ao buscar via cep
          }
        }

        // Envia para o backend
        await completarCadastroPaciente(
          user.userId,
          patientData?.cpf || "",
          patientData?.email || updatedPatientData.email || "",
          {
            nome,
            telefone,
            cep,
            numero,
            complemento: complemento || undefined,
            ...enderecoViaCep,
          }
        );
      } catch (e) {
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
      const response = await updatePatientAvatar(user.userId, {
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
              firstName={patientData.firstName || "Não informado"}
              lastName={patientData.lastName || "Não informado"}
              email={patientData.email || "Não informado"}
              phone={patientData.phone || "Não informado"}
              dob={patientData.dob || "Não informado"}
              sex={
                typeof patientData.sex === "boolean" ? patientData.sex : false
              }
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
          firstName: patientData.firstName || "",
          lastName: patientData.lastName || "",
          email: patientData.email || "",
          phone: patientData.phone || "",
          dob: patientData.dob || "",
          sex: typeof patientData.sex === "boolean" ? patientData.sex : false,
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
