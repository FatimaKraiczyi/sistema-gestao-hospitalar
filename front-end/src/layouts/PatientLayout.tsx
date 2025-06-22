import { useEffect, useState } from "react";
import { BaseLayout } from "./BaseLayout";
import {
  List,
  ListItemIcon,
  ListItemText,
  Divider,
  ListItemButton,
} from "@mui/material";
import EventNoteIcon from "@mui/icons-material/EventNote";
import DescriptionIcon from "@mui/icons-material/Description";
import { Outlet, useNavigate } from "react-router";
import { ROUTING } from "../constants/routing";
import { getPatientInfo } from "../services/authenticate/paciente_service";
import { useSelector } from "react-redux";
import { RootState } from "../stores/store";

export default function PatientLayout() {
  const navigate = useNavigate();
  const [currentTitle, setCurrentTitle] = useState("Meus Agendamentos");
  const userData = useSelector((state: RootState) => state.user.user);
  const titleMap: Record<string, string> = {
    appointments: "Meus Agendamentos",
    "find-doctor": "Encontrar Médico",
    "medical-records": "Meus Prontuários",
  };

  useEffect(() => {
    const fetchPatient = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("user") || "{}");
        const userId = user.userId || user.id;

        const response = await getPatientInfo(userId);
        const { id } = response.data.data;

        if (!id) {
          // Redireciona para PROFILE com modal aberto
          navigate(ROUTING.PROFILE, { state: { openModal: true } });
        }
      } catch (error: any) {
        // Caso o paciente ainda nem exista
        if (error.message === "Paciente não encontrado") {
          navigate(ROUTING.PROFILE, { state: { openModal: true } });
        } else {
          console.error("Erro ao verificar dados do paciente:", error.message);
        }
      }
    };

    fetchPatient();
  }, [userData, navigate]);

  useEffect(() => {
    if (location.pathname === ROUTING.PACIENTE) {
      navigate(ROUTING.APPOINTMENTS);
      setCurrentTitle(titleMap["appointments"]);
    }
  }, [location.pathname, navigate]);

  const handleNavigation = (path: string) => {
    navigate(path);
    setCurrentTitle(titleMap[path]);
  };

  const sidebarContent = (
    <>
      <List>
        <ListItemButton onClick={() => handleNavigation(ROUTING.APPOINTMENTS)}>
          <ListItemIcon>
            <EventNoteIcon />
          </ListItemIcon>
          <ListItemText primary="Agendamentos" />
        </ListItemButton>
      </List>
      <Divider />
      <List>
        <ListItemButton
          onClick={() => handleNavigation(ROUTING.MEDICAL_RECORDS)}
        >
          <ListItemIcon>
            <DescriptionIcon />
          </ListItemIcon>
          <ListItemText primary="Pontos" />
        </ListItemButton>
      </List>
    </>
  );

  return (
    <BaseLayout title={`${currentTitle}`} sidebarContent={sidebarContent}>
      <Outlet />
    </BaseLayout>
  );
}
