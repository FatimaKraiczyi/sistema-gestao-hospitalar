import React, { useEffect } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  TextField,
  Button,
  FormControlLabel,
  Switch,
} from "@mui/material";
import { Disease } from "../../types/typeDisease";
import { useFormik } from "formik";
import * as Yup from "yup";

// Interface que define as props para o componente DiseaseForm
interface DiseaseFormProps {
  open: boolean; // Estado de exibição do modal
  onClose: () => void; // Função para fechar o modal
  onSubmit: (disease: Partial<Disease>) => void; // Função para submit do formulário
  disease?: Disease | null; // Informações da doença (ao editar)
  mode: "add" | "edit"; // Modo do formulário: adicionar ou editar
}

// Schema de validação usando Yup
const validationSchema = Yup.object({
  name: Yup.string()
    .required("O nome da doença é obrigatório")
    .max(255, "O nome da doença não pode exceder 255 caracteres"),
});

const DiseaseForm: React.FC<DiseaseFormProps> = ({
  open,
  onClose,
  onSubmit,
  disease,
  mode,
}) => {
  // Usando formik para gerenciar o formulário e validação
  const formik = useFormik({
    initialValues: {
      name: "",
      status: true,
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      onSubmit(values);
    },
  });

  // Effect para atualizar os valores do formulário ao editar
  // Ou resetar ao adicionar novo
  useEffect(() => {
    if (disease && mode === "edit") {
      formik.setValues({
        name: disease.name,
        status: disease.status,
      });
    } else if (mode === "add") {
      formik.resetForm();
      formik.setValues({
        name: "",
        status: true,
      });
    }
  }, [disease, mode, open]);

  // Lida com o fechamento do modal e reseta o formulário
  const handleClose = () => {
    formik.resetForm();
    onClose();
  };

  // Define título e botão conforme o modo do formulário
  const title =
    mode === "add" ? "Adicionar nova doença" : "Editar informações da doença";
  const buttonText = mode === "add" ? "Adicionar doença" : "Salvar alterações";

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>{title}</DialogTitle>
      <form onSubmit={formik.handleSubmit}>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                name="name"
                label="Nome da doença"
                value={formik.values.name}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.name && Boolean(formik.errors.name)}
                helperText={formik.touched.name && formik.errors.name}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    name="status"
                    checked={formik.values.status}
                    onChange={formik.handleChange}
                  />
                }
                label="Ativo"
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

export default DiseaseForm;
