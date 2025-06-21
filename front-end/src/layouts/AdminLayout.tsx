import React from "react";
import { BaseLayout } from "./BaseLayout";
import {
  List,
  ListItemIcon,
  ListItemText,
  ListItemButton,
} from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PeopleIcon from "@mui/icons-material/People";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import MedicalServicesIcon from "@mui/icons-material/MedicalServices";
import EventBusyIcon from "@mui/icons-material/EventBusy";
import MedicationIcon from "@mui/icons-material/Medication";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import { useNavigate } from "react-router";
import { Outlet } from "react-router";

export const AdminLayout: React.FC = () => {
  const navigate = useNavigate();

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  const sidebarContent = (
    <>
      <List>
        <ListItemButton onClick={() => handleNavigation("/admin/dashboard")}>
          <ListItemIcon>
            <DashboardIcon />
          </ListItemIcon>
          <ListItemText primary="Estatísticas" />
        </ListItemButton>
        <ListItemButton onClick={() => handleNavigation("/admin/users")}>
          <ListItemIcon>
            <PeopleIcon />
          </ListItemIcon>
          <ListItemText primary="Gerenciar pacientes" />
        </ListItemButton>
        <ListItemButton onClick={() => handleNavigation("/admin/doctors")}>
          <ListItemIcon>
            <LocalHospitalIcon />
          </ListItemIcon>
          <ListItemText primary="Gerenciar médicos" />
        </ListItemButton>
        {/* Medicamentos */}
        <ListItemButton onClick={() => handleNavigation("/admin/drugs")}>
          <ListItemIcon>
            <MedicationIcon />
          </ListItemIcon>
          <ListItemText primary="Gerenciar medicamentos" />
        </ListItemButton>
        {/* Gerenciar turnos */}
        <ListItemButton onClick={() => handleNavigation("/admin/shifts")}>
          <ListItemIcon>
            <AccessTimeIcon />
          </ListItemIcon>
          <ListItemText primary="Gerenciar turnos" />
        </ListItemButton>
        {/* Gerenciar grupos de doenças */}
        <ListItemButton onClick={() => handleNavigation("/admin/diseases")}>
          <ListItemIcon>
            <MedicalServicesIcon />
          </ListItemIcon>
          <ListItemText primary="Gerenciar grupos de doenças" />
        </ListItemButton>
        {/* Gerenciar agendamentos */}
        <ListItemButton
          onClick={() => handleNavigation("/admin/cancel-appointment")}
        >
          <ListItemIcon>
            <EventBusyIcon />
          </ListItemIcon>
          <ListItemText primary="Gerenciar agendamentos" />
        </ListItemButton>
        {/* Gerenciar preços */}
        <ListItemButton onClick={() => handleNavigation("/admin/prices")}>
          <ListItemIcon>
            <AttachMoneyIcon />
          </ListItemIcon>
          <ListItemText primary="Gerenciar preços" />
        </ListItemButton>
      </List>

      {/* <Divider /> */}
      {/* <List>
				<ListItemButton onClick={() => handleNavigation("/admin/settings")}>
					<ListItemIcon>
						<SettingsIcon />
					</ListItemIcon>
					<ListItemText primary="Configurações" />
				</ListItemButton>
			</List> */}
    </>
  );

  return (
    <BaseLayout title="Painel Administrativo" sidebarContent={sidebarContent}>
      <Outlet />
    </BaseLayout>
  );
};

export default AdminLayout;
