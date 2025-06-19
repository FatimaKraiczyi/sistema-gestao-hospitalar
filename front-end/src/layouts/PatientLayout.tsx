import { useState } from "react";
import { BaseLayout } from "./BaseLayout";
import {
  List,
  ListItemIcon,
  ListItemText,
  Divider,
  ListItemButton,
} from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import EventNoteIcon from "@mui/icons-material/EventNote";
import DescriptionIcon from "@mui/icons-material/Description";
import { Outlet, useNavigate } from "react-router";
import { ROUTING } from "../constants/routing";

export default function PatientLayout() {
  const navigate = useNavigate();
  const [currentTitle, setCurrentTitle] = useState("Dashboard");

  const titleMap: Record<string, string> = {
    dashboard: "Dashboard",
    appointments: "My Appointments",
    "find-doctor": "Find Doctor",
    "medical-records": "Hồ sơ bệnh án của tôi",
  };

  const handleNavigation = (path: string) => {
    navigate(path);
    setCurrentTitle(titleMap[path] || "Patient Dashboard");
  };

  const sidebarContent = (
    <>
      <List>
        <ListItemButton onClick={() => handleNavigation(ROUTING.DASHBOARD)}>
          <ListItemIcon>
            <DashboardIcon />
          </ListItemIcon>
          <ListItemText primary="Thống kê" />
        </ListItemButton>
        <ListItemButton onClick={() => handleNavigation(ROUTING.APPOINTMENTS)}>
          <ListItemIcon>
            <EventNoteIcon />
          </ListItemIcon>
          <ListItemText primary="Lịch hẹn" />
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
          <ListItemText primary="Hồ sơ bệnh án" />
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
