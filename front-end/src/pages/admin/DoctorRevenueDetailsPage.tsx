import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Paper,
  Box,
  CircularProgress,
  Alert,
  Button,
} from "@mui/material";
import {
  DataGrid,
  GridColDef,
  GridToolbar,
  GridCsvExportOptions,
} from "@mui/x-data-grid";
import { useParams, useNavigate } from "react-router";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import DownloadIcon from "@mui/icons-material/Download";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import {
  getListDoctorByQuarter,
  getListDoctorByMonth,
  getListDoctorByYear,
} from "../../services/appointment/dashboard_service";
import { useSelector } from "react-redux";

// Interface para os dados de receita do médico
interface DoctorRevenue {
  id: string;
  doctorId: string;
  doctorName: string;
  specialty: string;
  patientsCount: number;
  totalRevenue: number;
}

const DoctorRevenueDetailsPage: React.FC = () => {
  const { periodType, period } = useParams<{
    periodType: string;
    period: string;
  }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [doctorRevenues, setDoctorRevenues] = useState<DoctorRevenue[]>([]);

  // Obtém informações do usuário do Redux store
  const user = useSelector((state: any) => state.user.user);

  useEffect(() => {
    const fetchDoctorRevenues = async () => {
      try {
        setLoading(true);

        let response;
        console.log("period", period);

        // Chama a API apropriada de acordo com o tipo de período
        if (periodType === "quarter" && period) {
          // Remove o "Q" da string do trimestre (ex: "Q1" -> "1")
          const quarterNumber = period.replace("Q", "");
          response = await getListDoctorByQuarter(quarterNumber);
        } else if (periodType === "month" && period) {
          const monthNumber = period.replace("T", "");
          response = await getListDoctorByMonth(monthNumber);
        } else if (periodType === "year" && period) {
          response = await getListDoctorByYear(period);
        } else {
          throw new Error("Tipo de período inválido");
        }
        console.log("API response:", response);
        if (response?.code === 200 && Array.isArray(response.data)) {
          // Converte os dados da API para o formato da interface
          const formattedData: DoctorRevenue[] = response.data.map(
            (item: any) => ({
              id: item.doctor.userId,
              doctorId: item.doctor.userId.toString(),
              doctorName: `${item.doctor.lastName} ${item.doctor.firstName}`,
              specialty:
                item.doctor.typeDisease?.name ||
                item.doctor.specialization ||
                "Não identificado",
              patientsCount: item.total_patients || 0,
              totalRevenue: item.total_salaries || 0,
            })
          );

          console.log("API data transformed:", formattedData);
          setDoctorRevenues(formattedData);
        } else {
          console.error("Formato de resposta da API inválido:", response);
          throw new Error("Dados inválidos");
        }
      } catch (err) {
        console.error("Erro ao carregar dados de receita do médico:", err);
        setError(
          `Não foi possível carregar os dados de receita do médico: ${
            err instanceof Error ? err.message : "Erro desconhecido"
          }`
        );
      } finally {
        setLoading(false);
      }
    };

    if (periodType && period) {
      fetchDoctorRevenues();
    } else {
      setError("Informação de período inválida");
      setLoading(false);
    }
  }, [periodType, period]);

  // Formata moeda
  const formatCurrency = (amount: number): string => {
    if (typeof amount !== "number" || isNaN(amount)) {
      return "0 ₫";
    }
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Configuração de exportação CSV
  const csvOptions: GridCsvExportOptions = {
    fileName: `receita-medico-${periodType}-${period}-${new Date().getFullYear()}`,
    delimiter: ",",
    utf8WithBom: true,
  };

  // Configuração das colunas da tabela
  const columns: GridColDef[] = [
    {
      field: "doctorId",
      headerName: "ID do Médico",
      flex: 1.5,
      minWidth: 180,
      resizable: true,
    },
    {
      field: "doctorName",
      headerName: "Nome do Médico",
      flex: 2,
      minWidth: 200,
      resizable: true,
    },
    {
      field: "specialty",
      headerName: "Especialidade",
      flex: 1.5,
      minWidth: 150,
      resizable: true,
    },
    {
      field: "patientsCount",
      headerName: "Quantidade de Pacientes",
      type: "number",
      flex: 1,
      minWidth: 120,
      resizable: true,
    },
    {
      field: "totalRevenue",
      headerName: "Receita Total",
      type: "number",
      flex: 1.5,
      minWidth: 150,
      resizable: true,
      valueFormatter: (value) => {
        const total = typeof value === "number" ? value : 0;
        return formatCurrency(total);
      },
    },
  ];

  // Formata o título do período
  const getPeriodTitle = () => {
    if (periodType === "quarter") {
      return `TRIMESTRE ${period?.replace("Q", "")}`;
    } else if (periodType === "month") {
      return `MÊS ${period?.replace("T", "")}`;
    } else if (periodType === "year") {
      return `ANO ${period}`;
    }
    return "";
  };

  // Ação ao clicar em voltar
  const handleBackClick = () => {
    navigate("/admin/dashboard");
  };

  // Função para exportar Excel com template
  const handleExcelExport = async () => {
    try {
      console.log("Iniciando exportação para Excel");

      // Busca o arquivo template da pasta public
      const response = await fetch("/template.xlsx");
      const templateArrayBuffer = await response.arrayBuffer();

      // Carrega o template no ExcelJS
      const workbook = new ExcelJS.Workbook();
      await workbook.xlsx.load(templateArrayBuffer);

      // Pega a primeira planilha
      const worksheet = workbook.getWorksheet(1);

      // Adiciona detalhes do relatório no cabeçalho
      worksheet.getCell("D2").value = `${getPeriodTitle()}`;
      worksheet.getCell("D2").font = { bold: true, size: 16 };

      // Adiciona o nome do responsável pelo relatório na célula B3 (do Redux)
      const reporterName = user ? `${user.firstName} ${user.lastName}` : "N/A";
      worksheet.getCell("B3").value = reporterName;
      worksheet.getCell("B3").font = { size: 12 };

      // Adiciona a data do relatório na célula B4
      const currentDate = new Date();
      const formattedDate = `${currentDate.getDate()}/${
        currentDate.getMonth() + 1
      }/${currentDate.getFullYear()}`;
      worksheet.getCell("B4").value = formattedDate;
      worksheet.getCell("B4").font = { size: 12 };

      // Adiciona os dados a partir da linha 7
      doctorRevenues.forEach((doctor, index) => {
        if (index > 0) {
          worksheet.insertRow(index + 7, [], "i");
        }

        const row = worksheet.getRow(index + 7);

        row.getCell(1).value = index + 1; // Nº
        row.getCell(2).value = doctor.doctorId; // ID do Médico
        row.getCell(3).value = doctor.doctorName; // Nome do Médico
        row.getCell(4).value = doctor.specialty; // Especialidade
        row.getCell(5).value = doctor.patientsCount; // Quantidade de Pacientes
        row.getCell(6).value = doctor.totalRevenue; // Receita Total

        row.commit();
      });

      // Soma total da receita
      const totalRevenue = doctorRevenues.reduce(
        (sum, doctor) => sum + doctor.totalRevenue,
        0
      );

      // Adiciona linha de total
      const summaryRowIndex = doctorRevenues.length + 6 + 1;
      worksheet.insertRow(summaryRowIndex, [], "i");
      const summaryRow = worksheet.getRow(summaryRowIndex);
      summaryRow.getCell(5).value = "Total:";
      summaryRow.getCell(6).value = totalRevenue;
      summaryRow.commit();

      // Espaço para assinatura (3 linhas após o total)
      const signatureRow = doctorRevenues.length + 6 + 3;

      // Adiciona data
      const dateRow = worksheet.getRow(signatureRow);
      dateRow.getCell(5).value = `Dia ... mês ... ano ...`;
      dateRow.getCell(5).alignment = { horizontal: "center" };
      dateRow.getCell(5).font = { size: 12 };
      dateRow.commit();

      // Adiciona contador
      const accountantRow = worksheet.getRow(signatureRow + 1);
      accountantRow.getCell(5).value = "Contador";
      accountantRow.getCell(5).alignment = {
        horizontal: "center",
        vertical: "middle",
      };
      accountantRow.getCell(5).font = { bold: true, size: 14 };
      accountantRow.commit();

      // Adiciona (assinar, nome completo)
      const signatureInfoRow = worksheet.getRow(signatureRow + 2);
      signatureInfoRow.getCell(5).value = "(Assinar, nome completo)";
      signatureInfoRow.getCell(5).alignment = { horizontal: "center" };
      signatureInfoRow.getCell(5).font = { italic: true };
      signatureInfoRow.commit();

      const buffer = await workbook.xlsx.writeBuffer();

      const blob = new Blob([buffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

      saveAs(blob, `receita-medico-${periodType}-${period}.xlsx`);
    } catch (error) {
      console.error("Erro ao exportar Excel:", error);
      alert("Ocorreu um erro ao exportar o arquivo Excel. Tente novamente.");
    }
  };

  // Exibe carregando
  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ display: "flex", justifyContent: "center", my: 4 }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  // Exibe erro
  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={handleBackClick}
          sx={{ mr: 2 }}
        >
          Voltar
        </Button>
        <Typography variant="h4" fontWeight="bold">
          Receita por Médico - {getPeriodTitle()} ano {new Date().getFullYear()}
        </Typography>
        <Box sx={{ flexGrow: 1 }} />
        <Button
          variant="contained"
          color="primary"
          startIcon={<DownloadIcon />}
          onClick={handleExcelExport}
          sx={{ ml: 2 }}
        >
          Exportar Excel
        </Button>
      </Box>
      <Paper sx={{ width: "100%", overflow: "hidden" }}>
        <DataGrid
          rows={doctorRevenues}
          columns={columns}
          autoHeight
          initialState={{
            pagination: {
              paginationModel: { page: 0, pageSize: 10 },
            },
            sorting: {
              sortModel: [{ field: "totalRevenue", sort: "desc" }],
            },
          }}
          pageSizeOptions={[5, 10, 25]}
          checkboxSelection={false}
          disableRowSelectionOnClick
          sx={{ minHeight: 400 }}
          slots={{ toolbar: GridToolbar }}
          slotProps={{
            toolbar: {
              showQuickFilter: true,
              quickFilterProps: { debounceMs: 500 },
              csvOptions: csvOptions,
              printOptions: {
                disableToolbarButton: false,
                hideFooter: false,
              },
            },
          }}
        />
      </Paper>
    </Container>
  );
};

export default DoctorRevenueDetailsPage;
