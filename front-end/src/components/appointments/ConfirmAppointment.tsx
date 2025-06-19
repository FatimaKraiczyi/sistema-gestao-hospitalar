import React from "react";
import {
  Box,
  Typography,
  Paper,
  Grid,
  Button,
  Divider,
  Avatar,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import EventIcon from "@mui/icons-material/Event";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import PersonIcon from "@mui/icons-material/Person";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import { format } from "date-fns";

/**
 * Props para o componente ConfirmAppointment
 * @param date - Data da consulta selecionada
 * @param time - Horário da consulta selecionado
 * @param doctor - Informações do médico selecionado
 * @param specialty - Informações do serviço/especialidade selecionado (opcional)
 * @param onDone - Função callback quando o usuário finaliza o agendamento
 */
interface ConfirmAppointmentProps {
  date: Date;
  time: string;
  doctor: any;
  specialty?: any; // Giờ đại diện cho dịch vụ
  onDone: () => void;
}

/**
 * Componente que exibe a tela de confirmação de agendamento bem-sucedido
 * Mostra um resumo das informações do agendamento: data, hora, médico e serviço
 */
const ConfirmAppointment: React.FC<ConfirmAppointmentProps> = ({
  date,
  time,
  doctor,
  specialty, // Giờ đại diện cho dịch vụ
  onDone,
}) => {
  return (
    <Box sx={{ textAlign: "center", py: 3 }}>
      {/* Ícone de agendamento bem-sucedido */}
      <CheckCircleIcon sx={{ fontSize: 64, color: "success.main", mb: 2 }} />

      {/* Mensagem de agendamento bem-sucedido */}
      <Typography variant="h5" gutterBottom>
        {t("patient.appointments.booking_successful")}
      </Typography>

      <Typography variant="body1" color="text.secondary" paragraph>
        {t("patient.appointments.booking_confirmation_message")}
      </Typography>

      {/* Caixa com detalhes do agendamento */}
      <Paper sx={{ maxWidth: 600, mx: "auto", mt: 4, p: 3 }}>
        <Typography variant="h6" gutterBottom>
          {t("patient.appointments.appointment_details")}
        </Typography>
        <Divider sx={{ mb: 2 }} />

        {/* Lista de detalhes */}
        <List>
          {/* Data da consulta */}
          <ListItem>
            <ListItemAvatar>
              <Avatar>
                <EventIcon />
              </Avatar>
            </ListItemAvatar>
            <ListItemText
              primary={t("patient.appointments.date")}
              secondary={date.toLocaleDateString()}
            />
          </ListItem>

          {/* Horário da consulta */}
          <ListItem>
            <ListItemAvatar>
              <Avatar>
                <AccessTimeIcon />
              </Avatar>
            </ListItemAvatar>
            <ListItemText
              primary={t("patient.appointments.time")}
              secondary={time.start + " - " + time.end}
            />
          </ListItem>

          {/* Informações do médico */}
          <ListItem>
            <ListItemAvatar>
              <Avatar src={doctor.avatar ?? ""}>
                <PersonIcon />
              </Avatar>
            </ListItemAvatar>
            <ListItemText
              primary={t("patient.appointments.doctor")}
              secondary={`${doctor.firstName} ${doctor.lastName}`}
            />
          </ListItem>

          {/* Thông tin dịch vụ (hiển thị nếu có) */}
          {specialty && (
            <ListItem>
              <ListItemAvatar>
                <Avatar>
                  <LocalHospitalIcon />
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={t("patient.appointments.service")}
                secondary={specialty.name}
              />
            </ListItem>
          )}
        </List>
      </Paper>

      {/* Nút quay lại trang lịch hẹn */}
      <Box sx={{ mt: 4 }}>
        <Button
          variant="contained"
          color="primary"
          onClick={onDone}
          size="large"
        >
          {t("patient.appointments.back_to_appointments")}
        </Button>
      </Box>
    </Box>
  );
};

export default ConfirmAppointment;
