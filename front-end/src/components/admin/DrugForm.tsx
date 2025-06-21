import React, { useEffect } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  TextField,
  Button,
} from "@mui/material";
import { Drug } from "../../types/medical";
import { useFormik } from "formik";
import * as Yup from "yup";

// Interface que define as props para o componente DrugForm
// Permite usar o mesmo formulário para adicionar e editar
interface DrugFormProps {
  open: boolean; // Estado de exibição do modal
  onClose: () => void; // Função chamada ao fechar o modal
  onSubmit: (drug: Partial<Drug>) => void; // Função chamada ao submeter o formulário
  drug?: Drug | null; // Informações do medicamento (ao editar)
  mode: "add" | "edit"; // Modo do formulário: adicionar ou editar
}

// Schema de validação usando Yup
// Define as regras de validação dos dados inseridos
const validationSchema = Yup.object({
  drugName: Yup.string()
    .required("Nome do medicamento é obrigatório")
    .min(2, "O nome do medicamento deve ter pelo menos 2 caracteres"),
  drugType: Yup.string().required("Tipo do medicamento é obrigatório"),
  unit: Yup.string()
    .required("Unidade é obrigatória")
    .min(1, "Unidade não pode estar vazia"),
});

const DrugForm: React.FC<DrugFormProps> = ({
  open,
  onClose,
  onSubmit,
  drug,
  mode,
}) => {
  // Usa formik para gerenciar o formulário e validação
  const formik = useFormik({
    initialValues: {
      drugName: "",
      drugType: "",
      unit: "",
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      onSubmit(values);
    },
  });

  // Atualiza os valores do formulário ao editar ou reseta ao adicionar
  useEffect(() => {
    if (drug && mode === "edit") {
      formik.setValues({
        drugName: drug.drugName,
        drugType: drug.drugType || "",
        unit: drug.unit,
      });
    } else if (mode === "add") {
      formik.resetForm();
    }
  }, [drug, mode]);

  // Fecha o modal e reseta o formulário
  const handleClose = () => {
    formik.resetForm();
    onClose();
  };

  // Define título e texto do botão conforme o modo
  const title =
    mode === "add"
      ? "Adicionar novo medicamento"
      : "Editar informações do medicamento";
  const buttonText =
    mode === "add" ? "Adicionar medicamento" : "Salvar alterações";

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>{title}</DialogTitle>
      <form onSubmit={formik.handleSubmit}>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                name="drugName"
                label="Nome do medicamento"
                value={formik.values.drugName}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={
                  formik.touched.drugName && Boolean(formik.errors.drugName)
                }
                helperText={formik.touched.drugName && formik.errors.drugName}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="drugType"
                label="Tipo do medicamento"
                value={formik.values.drugType}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={
                  formik.touched.drugType && Boolean(formik.errors.drugType)
                }
                helperText={formik.touched.drugType && formik.errors.drugType}
                fullWidth
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="unit"
                label="Unidade"
                value={formik.values.unit}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.unit && Boolean(formik.errors.unit)}
                helperText={formik.touched.unit && formik.errors.unit}
                fullWidth
                required
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="error">
            Cancelar
          </Button>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={formik.isSubmitting}
          >
            {buttonText}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default DrugForm;
