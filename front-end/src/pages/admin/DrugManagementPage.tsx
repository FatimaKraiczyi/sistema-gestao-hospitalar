import React, { useState, useEffect, useRef } from "react";
import {
  DataGrid,
  GridColDef,
  GridCsvExportOptions,
  GridRenderCellParams,
  GridToolbar,
} from "@mui/x-data-grid";
import {
  Box,
  IconButton,
  Paper,
  Button,
  Snackbar,
  Alert,
  CircularProgress,
} from "@mui/material";
import { Edit, Delete, Add, UploadFile } from "@mui/icons-material";
import { Drug } from "../../types/medical";
import DrugForm from "../../components/admin/DrugForm";
import {
  getDrugs,
  addDrug,
  updateDrug,
  importDrug,
} from "../../services/admin/drugs_service";
import * as XLSX from "xlsx";

const DrugManagementPage: React.FC = () => {
  // Declaração de estados para gerenciar dados e UI
  const [drugs, setDrugs] = useState<Drug[]>([]); // Lista de medicamentos
  const [isFormOpen, setIsFormOpen] = useState<boolean>(false); // Estado do formulário
  const [formMode, setFormMode] = useState<"add" | "edit">("add"); // Modo do formulário: adicionar/editar
  const [selectedDrug, setSelectedDrug] = useState<Drug | null>(null); // Medicamento selecionado
  const [loading, setLoading] = useState<boolean>(true); // Estado de carregamento
  const [error, setError] = useState<string | null>(null); // Erro, se houver
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "error" | "info" | "warning";
  }>({
    open: false,
    message: "",
    severity: "info",
  });
  const [importing, setImporting] = useState<boolean>(false); // Estado de importação

  const csvOptions: GridCsvExportOptions = {
    fileName: "medicamentos",
    delimiter: ",",
    utf8WithBom: true,
  };

  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchDrugs = async () => {
    try {
      setLoading(true);
      const response = await getDrugs();
      if (response && response.data) {
        setDrugs(response.data);
      } else {
        setError("Não foi possível carregar a lista de medicamentos");
      }
    } catch (error) {
      console.error("Erro ao buscar medicamentos:", error);
      setError("Ocorreu um erro ao carregar a lista de medicamentos");
    } finally {
      setLoading(false);
    }
  };

  // Buscar medicamentos ao montar o componente
  useEffect(() => {
    fetchDrugs();
  }, []);

  // Fechar snackbar
  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  // Exibir mensagem no snackbar
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

  // Abrir formulário para adicionar novo medicamento
  const handleAddClick = () => {
    setFormMode("add");
    setSelectedDrug(null);
    setIsFormOpen(true);
  };

  // Abrir formulário para editar medicamento
  const handleEditClick = (drug: Drug) => {
    setFormMode("edit");
    setSelectedDrug(drug);
    setIsFormOpen(true);
  };

  // Fechar formulário
  const handleFormClose = () => {
    setIsFormOpen(false);
  };

  // Submeter formulário (adicionar ou editar)
  const handleFormSubmit = async (drugData: Partial<Drug>) => {
    try {
      if (formMode === "add") {
        // Adicionar novo medicamento via API
        const response = await addDrug(drugData);
        if (response && response.data) {
          setDrugs([...drugs, response.data]);
          showMessage("Medicamento adicionado com sucesso", "success");
        }
      } else {
        // Editar medicamento via API
        if (selectedDrug) {
          const response = await updateDrug(
            selectedDrug.id.toString(),
            drugData
          );
          if (response && response.data) {
            setDrugs(
              drugs.map((drug) =>
                drug.id === selectedDrug.id ? response.data : drug
              )
            );
            showMessage("Medicamento atualizado com sucesso", "success");
          }
        }
      }
      setIsFormOpen(false);
    } catch (error) {
      console.error(
        `Erro ao ${
          formMode === "add" ? "adicionar" : "atualizar"
        } medicamento:`,
        error
      );
      showMessage(
        `Erro ao ${formMode === "add" ? "adicionar" : "atualizar"} medicamento`,
        "error"
      );
    }
  };

  // Excluir medicamento (ainda sem API)
  const handleDeleteClick = (id: number) => {
    if (window.confirm("Tem certeza que deseja excluir este medicamento?")) {
      setDrugs(drugs.filter((drug) => drug.id !== id));
      showMessage("Medicamento excluído com sucesso", "success");
    }
  };

  // Importar arquivo
  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

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
          const json = XLSX.utils.sheet_to_json(worksheet, { defval: "" });
          console.log("Arquivo para JSON:", json);

          // Chamar API de importação
          try {
            const response = await importDrug(json);
            if (response && response.data) {
              showMessage(
                "Importação de medicamentos realizada com sucesso",
                "success"
              );
              fetchDrugs();
            } else {
              showMessage(
                "Ocorreu um erro ao importar os medicamentos",
                "error"
              );
            }
          } catch (apiError) {
            console.error("Erro ao importar medicamentos:", apiError);
            showMessage(
              "Ocorreu um erro ao enviar os medicamentos para o servidor",
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
    // Resetar input para permitir selecionar o mesmo arquivo novamente
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
      field: "drugName",
      headerName: "Nome do medicamento",
      width: 300,
      flex: 2,
    },
    {
      field: "drugType",
      headerName: "Tipo",
      width: 200,
      flex: 1.5,
    },
    {
      field: "unit",
      headerName: "Unidade",
      width: 150,
      flex: 1,
    },
    {
      field: "actions",
      headerName: "Ações",
      width: 120,
      flex: 0.7,
      sortable: false,
      disableExport: true,
      renderCell: (params: GridRenderCellParams) => (
        <Box sx={{ display: "flex", gap: 1, height: "100%" }}>
          <IconButton
            size="small"
            color="info"
            title="Editar"
            onClick={() => handleEditClick(params.row)}
          >
            <Edit fontSize="small" />
          </IconButton>
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
      {/* Header com botões de adicionar e importar */}
      <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2, gap: 2 }}>
        <Button
          variant="contained"
          color="primary"
          startIcon={<Add />}
          onClick={handleAddClick}
        >
          Adicionar medicamento
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
        <input
          ref={fileInputRef}
          type="file"
          accept=".csv,.xlsx,.xls"
          style={{ display: "none" }}
          onChange={handleFileChange}
        />
      </Box>

      {/* Tabela de medicamentos */}
      <Paper sx={{ width: "100%" }}>
        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Box sx={{ p: 3, color: "error.main" }}>{error}</Box>
        ) : (
          <DataGrid
            rows={drugs}
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

      {/* Formulário de adicionar/editar medicamento */}
      <DrugForm
        open={isFormOpen}
        onClose={handleFormClose}
        onSubmit={handleFormSubmit}
        drug={selectedDrug}
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

export default DrugManagementPage;
