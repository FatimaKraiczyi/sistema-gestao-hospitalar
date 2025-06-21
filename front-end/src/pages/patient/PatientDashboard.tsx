/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from "react";
import {
  Typography,
  Paper,
  Grid,
  CircularProgress,
  Box,
  Alert,
  Stack,
  ToggleButtonGroup,
  ToggleButton,
  List,
  ListItem,
  ListItemText,
  Divider,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import EmptyState from "../../components/EmptyState";
import { BarChart } from "@mui/x-charts/BarChart";
import { PieChart } from "@mui/x-charts/PieChart";
import EventIcon from "@mui/icons-material/Event";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import MedicalServicesIcon from "@mui/icons-material/MedicalServices";
import { format } from "date-fns";
import { getPatientDashboard } from "../../services/appointment/dashboard_service";
import { ROUTING } from "../../constants/routing";
import { getPatientInfo } from "../../services/authenticate/user_service";
import { RootState } from "../../stores/store";

interface Appointment {
  id: number;
  workScheduleId: number;
  date: string;
  startTime: string;
  endTime: string;
  status: "WAITING" | "IN_PROGRESS" | "DONE" | "CANCELLED";
  doctorName: string;
  specialization: string;
  reason?: string;
  doctorId?: number;
  numericalOrder?: number;
}
interface DashboardResponse {
  charts: {
    monthly: Record<string, number>;
    yearly: Record<string, number>;
  };
  appointments: {
    book_appointment: {
      id: number;
      patientId: string;
      workSchedule: number;
      numericalOrder: number;
      note: string;
      createdAt: string;
      status: string;
    };
    work_schedule: {
      id: number;
      doctor: {
        id: number;
        userId: string;
        firstName: string;
        lastName: string;
        specialization: string;
        typeDisease: {
          name: string;
        };
      };
      shift: {
        start: string;
        end: string;
      };
      dateAppointment: string;
    };
  }[];
  appointmentStats: {
    total: number;
    cancelled: number;
    complete: number;
    upcoming: number;
  };
}

const PatientDashboard: React.FC = () => {
  // Estado para controlar a visualização de tempo (mês ou ano)
  const [timeView, setTimeView] = useState<"month" | "year">("month");

  // Estados separados para facilitar o gerenciamento
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [appointmentStats, setAppointmentStats] = useState({
    total: 0,
    completed: 0,
    upcoming: 0,
    cancelled: 0,
  });

  const [monthlyAppointments, setMonthlyAppointments] = useState({
    jan: 0,
    feb: 0,
    mar: 0,
    apr: 0,
    may: 0,
    jun: 0,
    jul: 0,
    aug: 0,
    sep: 0,
    oct: 0,
    nov: 0,
    dec: 0,
  });

  const [yearlyAppointments, setYearlyAppointments] = useState<
    Record<string, number>
  >({});

  const [todayAppointments, setTodayAppointments] = useState<Appointment[]>([]);
  const [appointmentsLoading, setAppointmentsLoading] = useState<boolean>(true);
  const [appointmentsError, setAppointmentsError] = useState<string | null>(
    null
  );
  const userData = useSelector((state: RootState) => state.user.user);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Função auxiliar para formatar hora do formato da API
  const formatTimeFromApiFormat = (timeString: string): string => {
    // Formata de "07-00-00" para "07:00"
    const parts = timeString.split("-");
    if (parts.length >= 2) {
      return `${parts[0]}:${parts[1]}`;
    }
    return timeString;
  };

  useEffect(() => {
    const fetchPatient = async () => {
      try {
        const response = await getPatientInfo(userData.id);
        const { nome, telefone } = response.data;

        if (!nome || !telefone) {
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
    const fetchPatientData = async () => {
      try {
        setLoading(true);
        setAppointmentsLoading(true);

        const response = await getPatientDashboard(userData.id);
        const dashboardData: DashboardResponse = response.data;

        setAppointmentStats({
          total: dashboardData.appointmentStats.total,
          completed: dashboardData.appointmentStats.complete,
          upcoming: dashboardData.appointmentStats.upcoming,
          cancelled: dashboardData.appointmentStats.cancelled,
        });

        setMonthlyAppointments({
          jan: dashboardData.charts.monthly.jan,
          feb: dashboardData.charts.monthly.feb,
          mar: dashboardData.charts.monthly.mar,
          apr: dashboardData.charts.monthly.apr,
          may: dashboardData.charts.monthly.may,
          jun: dashboardData.charts.monthly.jun,
          jul: dashboardData.charts.monthly.jul,
          aug: dashboardData.charts.monthly.aug,
          sep: dashboardData.charts.monthly.sep,
          oct: dashboardData.charts.monthly.oct,
          nov: dashboardData.charts.monthly.nov,
          dec: dashboardData.charts.monthly.dec,
        });

        setYearlyAppointments(dashboardData.charts.yearly);

        const today = format(new Date(), "dd-MM-yyyy");
        const formattedAppointments: Appointment[] = dashboardData.appointments
          .filter((appt) => appt.work_schedule.dateAppointment === today)
          .map((appt) => ({
            id: appt.book_appointment.id,
            workScheduleId: appt.work_schedule.id,
            date: appt.work_schedule.dateAppointment,
            startTime: formatTimeFromApiFormat(appt.work_schedule.shift.start),
            endTime: formatTimeFromApiFormat(appt.work_schedule.shift.end),
            status: appt.book_appointment.status as any,
            doctorName: `Dr. ${appt.work_schedule.doctor.lastName} ${appt.work_schedule.doctor.firstName}`,
            specialization: appt.work_schedule.doctor.specialization,
            reason:
              appt.book_appointment.note ||
              appt.work_schedule.doctor.typeDisease.name,
            doctorId: appt.work_schedule.doctor.id,
            numericalOrder: appt.book_appointment.numericalOrder,
          }));
        setTodayAppointments(formattedAppointments);
        setError(null);
        setAppointmentsError(null);
      } catch (err) {
        setError("Não foi possível carregar os dados do paciente");
        setAppointmentsError(
          "Não foi possível carregar os dados das consultas"
        );
      } finally {
        setLoading(false);
        setAppointmentsLoading(false);
      }
    };

    fetchPatientData();
  }, [userData]);

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", my: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  if (!appointmentStats) {
    return <Alert severity="info">Carregando dados...</Alert>;
  }

  const handleTimeViewChange = (
    event: React.MouseEvent<HTMLElement>,
    newTimeView: "month" | "year" | null
  ) => {
    if (newTimeView !== null) {
      setTimeView(newTimeView);
    }
  };
  const handleAppointmentClick = (appointmentId: number) => {
    navigate(`/patient/appointments/${appointmentId}`);
  };
  const getChartConfig = () => {
    switch (timeView) {
      case "month":
        return {
          xAxisData: [
            "Jan",
            "Fev",
            "Mar",
            "Abr",
            "Mai",
            "Jun",
            "Jul",
            "Ago",
            "Set",
            "Out",
            "Nov",
            "Dez",
          ],
          seriesData: [
            monthlyAppointments.jan,
            monthlyAppointments.feb,
            monthlyAppointments.mar,
            monthlyAppointments.apr,
            monthlyAppointments.may,
            monthlyAppointments.jun,
            monthlyAppointments.jul,
            monthlyAppointments.aug,
            monthlyAppointments.sep,
            monthlyAppointments.oct,
            monthlyAppointments.nov,
            monthlyAppointments.dec,
          ],
          title: "Consultas no ano (por mês)",
        };
      case "year":
        const yearKeys = Object.keys(yearlyAppointments).sort();
        return {
          xAxisData: yearKeys,
          seriesData: yearKeys.map((year) => yearlyAppointments[year]),
          title: "Consultas por ano",
        };
      default:
        return { xAxisData: [], seriesData: [], title: "" };
    }
  };

  const chartConfig = getChartConfig();

  return (
    <>
      <Grid container spacing={3}>
        {/* Estatísticas de consultas com gráfico de pizza */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Estatísticas de consultas
            </Typography>
            <Stack spacing={2} mt={2}>
              <Box
                sx={{
                  height: 350,
                  width: "100%",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Typography
                  variant="h5"
                  align="center"
                  color="primary"
                  gutterBottom
                  sx={{ mb: 3 }}
                >
                  Total de consultas: {appointmentStats.total}
                </Typography>
                <PieChart
                  series={[
                    {
                      data: [
                        {
                          id: 0,
                          value: appointmentStats.completed,
                          label: "Concluídas",
                          color: "#4caf50",
                        },
                        {
                          id: 1,
                          value: appointmentStats.upcoming,
                          label: "Próximas",
                          color: "#2196f3",
                        },
                        {
                          id: 2,
                          value: appointmentStats.cancelled,
                          label: "Canceladas",
                          color: "#f44336",
                        },
                      ],
                      highlightScope: { faded: "global", highlighted: "item" },
                      faded: {
                        innerRadius: 30,
                        additionalRadius: -30,
                        color: "gray",
                      },
                    },
                  ]}
                  height={300}
                  width={500}
                  margin={{ top: 50, left: 50, right: 50 }}
                  slotProps={{
                    legend: {
                      hidden: false,
                      position: { vertical: "top", horizontal: "middle" },
                      direction: "row",
                    },
                  }}
                />
              </Box>
            </Stack>
          </Paper>
        </Grid>

        {/* Gráfico de consultas por mês/ano */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 2,
              }}
            >
              <Typography variant="h6" gutterBottom>
                {chartConfig.title}
              </Typography>
              <ToggleButtonGroup
                value={timeView}
                exclusive
                onChange={handleTimeViewChange}
                aria-label="time view"
                size="small"
              >
                <ToggleButton value="month" aria-label="month view">
                  Mês
                </ToggleButton>
                <ToggleButton value="year" aria-label="year view">
                  Ano
                </ToggleButton>
              </ToggleButtonGroup>
            </Box>
            <Stack spacing={2} mt={2}>
              <Box
                sx={{
                  height: 350,
                  width: "100%",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <BarChart
                  xAxis={[
                    {
                      scaleType: "band",
                      data: chartConfig.xAxisData,
                      tickLabelStyle: {
                        fontSize: 12,
                        fontWeight: 600,
                      },
                    },
                  ]}
                  series={[
                    {
                      data: chartConfig.seriesData,
                      label: "Consultas",
                    },
                  ]}
                  colors={["#2196f3"]}
                  height={320}
                  width={590}
                  yAxis={[
                    {
                      label: "Consultas",
                    },
                  ]}
                  margin={{ left: timeView === "year" ? 120 : 80 }}
                  tooltip={{ trigger: "item" }}
                />
              </Box>
            </Stack>
          </Paper>
        </Grid>

        {/* Consultas de hoje */}
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Typography
              variant="h6"
              gutterBottom
              mb={2}
              display="flex"
              alignItems="center"
            >
              <EventIcon sx={{ mr: 1 }} />
              Consultas de hoje
            </Typography>
            {appointmentsLoading ? (
              <Box sx={{ display: "flex", justifyContent: "center", py: 3 }}>
                <CircularProgress size={24} />
              </Box>
            ) : appointmentsError ? (
              <Alert severity="error" sx={{ mb: 2 }}>
                {appointmentsError}
              </Alert>
            ) : todayAppointments && todayAppointments.length > 0 ? (
              <List sx={{ width: "100%" }}>
                {todayAppointments.map((appointment, index) => (
                  <React.Fragment key={appointment.id}>
                    {index > 0 && <Divider component="li" />}
                    <ListItem
                      alignItems="flex-start"
                      sx={{
                        "&:hover": {
                          bgcolor: "rgba(0, 0, 0, 0.04)",
                          cursor: "pointer",
                        },
                      }}
                      onClick={() =>
                        handleAppointmentClick(appointment.workScheduleId)
                      }
                    >
                      <ListItemText
                        primary={
                          <Box
                            sx={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                              mb: 1,
                            }}
                          >
                            <Typography
                              variant="subtitle1"
                              component="span"
                              fontWeight="medium"
                            >
                              Nº: {appointment.numericalOrder} -{" "}
                              {appointment.doctorName}
                            </Typography>
                          </Box>
                        }
                        secondary={
                          <Box
                            sx={{
                              display: "flex",
                              flexDirection: "column",
                              gap: 0.5,
                            }}
                          >
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 1,
                              }}
                            >
                              <AccessTimeIcon
                                fontSize="small"
                                sx={{ color: "text.secondary", fontSize: 16 }}
                              />
                              <Typography
                                variant="body2"
                                color="text.secondary"
                                component="span"
                              >
                                {appointment.startTime} - {appointment.endTime}
                              </Typography>
                            </Box>
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 1,
                              }}
                            >
                              <MedicalServicesIcon
                                fontSize="small"
                                sx={{ color: "text.secondary", fontSize: 16 }}
                              />
                              <Typography
                                variant="body2"
                                color="text.secondary"
                                component="span"
                              >
                                {appointment.reason}
                              </Typography>
                            </Box>
                          </Box>
                        }
                        secondaryTypographyProps={{
                          component: "div",
                        }}
                      />
                    </ListItem>
                  </React.Fragment>
                ))}
              </List>
            ) : (
              <EmptyState message="Nenhuma consulta para hoje" />
            )}
          </Paper>
        </Grid>
      </Grid>
    </>
  );
};
export default PatientDashboard;
