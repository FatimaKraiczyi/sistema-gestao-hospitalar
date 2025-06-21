import React, { useState, useEffect, useRef } from "react";
import {
  DataGrid,
  GridColDef,
  GridRenderCellParams,
  GridToolbar,
  GridCsvExportOptions,
} from "@mui/x-data-grid";
import {
  Box,
  IconButton,
  Paper,
  Button,
  Chip,
  Snackbar,
  Alert,
  CircularProgress,
} from "@mui/material";
import { Edit, Delete, Add, UploadFile } from "@mui/icons-material";
import { Disease } from "../../types/typeDisease";
import DiseaseForm from "../../components/admin/DiseaseForm";
import {
  getAllTypeDiseases,
  addTypeDisease,
  deleteTypeDisease,
  importTypeDisease,
} from "../../services/admin/typeDisease_service";
import * as XLSX from "xlsx";

const DiseasManagementPage: React.FC = () => {
  // Estados para gerenciar dados e interface
  const [diseases, setDiseases] = useState<Disease[]>([]);
  const [isFormOpen, setIsFormOpen] = useState<boolean>(false);
  const [formMode, setFormMode] = useState<"add" | "edit">("add");
  const [selectedDisease, setSelectedDisease] = useState<Disease | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [importing, setImporting] = useState<boolean>(false);
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "error" | "info" | "warning";
  }>({
    open: false,
    message: "",
    severity: "info",
  });

  // Referência para input de arquivo oculto
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Configuração para exportação CSV
  const csvOptions: GridCsvExportOptions = {
    fileName: "doencas",
    delimiter: ",",
    utf8WithBom: true,
  };

  /**
   * Buscar lista de tipos de doenças da API
   */
  const fetchDiseases = async () => {
    try {
      setLoading(true);
      const response = await getAllTypeDiseases();
      if (response && response.data) {
        setDiseases(response.data);
      } else {
        setError("Não foi possível carregar a lista de tipos de doenças");
      }
    } catch (error) {
      console.error("Erro ao buscar doenças:", error);
      setError("Ocorreu um erro ao carregar a lista de tipos de doenças");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDiseases();
  }, []);

  /**
   * Fechar snackbar
   */
  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  /**
   * Exibir mensagem no snackbar
   */
  const showMessage = (
    message: string,
    severity: "success" | "error" | "info" | "warning"
  ) => {
    setSnackbar({
      open: true,
      message,
      severity,
    });
  };

  /**
   * Ao clicar em adicionar novo tipo de doença
   */
  const handleAddClick = () => {
    setFormMode("add");
    setSelectedDisease(null);
    setIsFormOpen(true);
  };

  /**
   * Ao clicar em editar tipo de doença
   */
  const handleEditClick = (disease: Disease) => {
    setFormMode("edit");
    setSelectedDisease(disease);
    setIsFormOpen(true);
  };

  /**
   * Fechar formulário
   */
  const handleFormClose = () => {
    setIsFormOpen(false);
  };

  /**
   * Submeter formulário de adicionar/editar
   */
  const handleFormSubmit = async (diseaseData: Partial<Disease>) => {
    try {
      if (formMode === "add") {
        const response = await addTypeDisease(diseaseData.name || "");
        if (response && response.data) {
          setDiseases([...diseases, response.data]);
          showMessage("Tipo de doença adicionado com sucesso", "success");
        }
      } else {
        showMessage("Função de atualização ainda não suportada", "info");
      }
      setIsFormOpen(false);
    } catch (error) {
      console.error(
        `Erro ao ${
          formMode === "add" ? "adicionar" : "atualizar"
        } tipo de doença:`,
        error
      );
      showMessage(
        `Erro ao ${
          formMode === "add" ? "adicionar" : "atualizar"
        } tipo de doença`,
        "error"
      );
    }
  };

  /**
   * Ao clicar em excluir (desativar) tipo de doença
   */
  const handleDeleteClick = async (id: number) => {
    if (
      window.confirm("Tem certeza que deseja desativar este tipo de doença?")
    ) {
      try {
        const diseaseToUpdate = diseases.find((disease) => disease.id === id);

        if (diseaseToUpdate) {
          const response = await deleteTypeDisease(id.toString());

          if (response && response.data) {
            setDiseases(
              diseases.map((disease) =>
                disease.id === id ? { ...disease, status: false } : disease
              )
            );
            showMessage("Tipo de doença desativado com sucesso", "success");
          }
        }
      } catch (error) {
        console.error("Erro ao desativar tipo de doença:", error);
        showMessage("Erro ao desativar tipo de doença", "error");
      }
    }
  };

  /**
   * Ao clicar em importar arquivo
   */
  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  /**
   * Ao selecionar arquivo para importar
   */
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    const fileName = file.name.toLowerCase();

    if (
      fileName.endsWith(".csv") ||
      fileName.endsWith(".xlsx") ||
      fileName.endsWith(".xls")
    ) {
      setImporting(true);
      reader.onload = async (evt) => {
        try {
          const data = evt.target?.result;
          const workbook = XLSX.read(data, { type: "binary" });
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          const rawData = XLSX.utils.sheet_to_json(worksheet, { defval: "" });

          const diseaseNames: string[] = rawData
            .map((row: any) => {
              const value =
                typeof row === "object" ? Object.values(row)[0] : row;
              return value?.toString() || "";
            })
            .filter((name) => name.trim() !== "");

          console.log("Nomes de tipos de doenças para importar:", diseaseNames);

          try {
            const response = await importTypeDisease(diseaseNames);
            if (response && response.data) {
              showMessage(
                "Importação de tipos de doenças realizada com sucesso",
                "success"
              );
              fetchDiseases();
            } else {
              showMessage(
                "Ocorreu um erro ao importar tipos de doenças",
                "error"
              );
            }
          } catch (apiError) {
            console.error("Erro ao importar tipos de doenças:", apiError);
            showMessage(
              "Ocorreu um erro ao enviar tipos de doenças para o servidor",
              "error"
            );
          } finally {
            setImporting(false);
          }
        } catch (parseError) {
          console.error("Erro ao processar arquivo:", parseError);
          showMessage(
            `Erro ao processar arquivo ${
              fileName.endsWith(".csv") ? "CSV" : "Excel"
            }`,
            "error"
          );
          setImporting(false);
        }
      };
      reader.readAsBinaryString(file);
    } else {
      showMessage(
        "Apenas arquivos .csv, .xlsx, .xls são suportados",
        "warning"
      );
    }
    e.target.value = "";
  };

  // Definição das colunas da tabela
  const columns: GridColDef[] = [
    {
      field: "id",
      headerName: "ID",
      width: 70,
      flex: 0.5,
    },
    {
      field: "name",
      headerName: "Nome do tipo de doença",
      width: 300,
      flex: 2,
    },
    {
      field: "status",
      headerName: "Status",
      width: 150,
      flex: 1,
      renderCell: (params: GridRenderCellParams) => (
        <Chip
          label={params.value ? "Ativo" : "Inativo"}
          color={params.value ? "success" : "error"}
          size="small"
        />
      ),
    },
    {
      field: "actions",
      headerName: "Ações",
      width: 70,
      flex: 0.5,
      sortable: false,
      disableExport: true,
      renderCell: (params: GridRenderCellParams) => (
        <Box
          sx={{
            display: "flex",
            gap: 1,
            height: "100%",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {/* <IconButton
						size="small"
						color="info"
						title="Editar"
						onClick={() => handleEditClick(params.row)}
					>
						<Edit fontSize="small" />
					</IconButton> */}
          <IconButton
            size="small"
            color="error"
            title="Excluir"
            onClick={() => handleDeleteClick(params.row.id)}
          >
            <Delete fontSize="small" />
          </IconButton>
        </Box>
      ),
    },
  ];

  return (
    <Box sx={{ height: "100%", width: "100%", padding: 0 }}>
      {/* Header com botões de ação */}
      <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2, gap: 2 }}>
        <Button
          variant="contained"
          color="primary"
          startIcon={<Add />}
          onClick={handleAddClick}
        >
          Adicionar tipo de doença
        </Button>
        <Button
          variant="contained"
          color="success"
          startIcon={
            importing ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              <UploadFile />
            )
          }
          onClick={handleImportClick}
          disabled={importing}
          sx={{ fontWeight: 600 }}
        >
          {importing ? "Importando..." : "Importar arquivo"}
        </Button>
        {/* Input oculto para importar arquivo */}
        <input
          ref={fileInputRef}
          type="file"
          accept=".csv,.xlsx,.xls"
          style={{ display: "none" }}
          onChange={handleFileChange}
        />
      </Box>

      {/* Tabela de tipos de doenças */}
      <Paper sx={{ width: "100%" }}>
        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Box sx={{ p: 3, color: "error.main" }}>{error}</Box>
        ) : (
          <DataGrid
            rows={diseases}
            columns={columns}
            initialState={{
              pagination: {
                paginationModel: { pageSize: 10 },
              },
            }}
            pageSizeOptions={[5, 10, 25, 50, 100]}
            slots={{ toolbar: GridToolbar }}
            slotProps={{
              toolbar: {
                showQuickFilter: true,
                quickFilterProps: { debounceMs: 500 },
                csvOptions: csvOptions,
              },
            }}
            disableRowSelectionOnClick
            disableColumnFilter={false}
            disableDensitySelector={false}
            disableColumnSelector={false}
            loading={loading}
          />
        )}
      </Paper>

      {/* Formulário de adicionar/editar tipo de doença */}
      <DiseaseForm
        open={isFormOpen}
        onClose={handleFormClose}
        onSubmit={handleFormSubmit}
        disease={selectedDisease}
        mode={formMode}
      />

      {/* Snackbar para mensagens */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default DiseasManagementPage;
