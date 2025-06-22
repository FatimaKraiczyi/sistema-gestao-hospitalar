// EditProfileModal.tsx
import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Grid,
  Box,
  CircularProgress,
  Snackbar,
  Alert,
} from "@mui/material";
import { updateInfo } from "../../services/authenticate/paciente_service";
import { useDispatch } from "react-redux";
import { setUser } from "../../stores/slices/user.slice";
import { Formik, Form, Field, FormikHelpers } from "formik";
import * as Yup from "yup";
import { cp } from "fs";

interface EditProfileModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
  isCompleting?: boolean;
  userData: {
    nome: string;
    sobrenome: string;
    cpf: string;
    email: string;
    telefone: string;
    logradouro: string;
    numero: string;
    complemento?: string;
    bairro: string;
    cidade: string;
    estado: string;
    cep: string;
  };
}

export const EditProfileModal: React.FC<EditProfileModalProps> = ({
  open,
  onClose,
  onSave,
  isCompleting,
  userData,
}) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error",
  });

  const initialValues = {
    cpf: userData.cpf || "",
    email: userData.email || "",
    nome: userData.nome || "",
    sobrenome: userData.sobrenome || "",
    telefone: userData.telefone || "",
    logradouro: userData.logradouro || "",
    numero: userData.numero || "",
    complemento: userData.complemento || "",
    bairro: userData.bairro || "",
    cidade: userData.cidade || "",
    estado: userData.estado || "",
    cep: userData.cep || "",
  };

  const validationSchema = Yup.object({
    nome: Yup.string().required("Nome é obrigatório"),
    sobrenome: Yup.string().required("Sobrenome é obrigatório"),
    telefone: Yup.string()
      .matches(/^\d{10,11}$/, "Telefone inválido")
      .required("Telefone é obrigatório"),
    numero: Yup.string().required("Número é obrigatório"),
    cep: Yup.string().required("CEP é obrigatório"),
  });

  const handleSubmit = async (
    values: typeof initialValues,
    { setSubmitting }: FormikHelpers<typeof initialValues>
  ) => {
    setLoading(true);
    try {
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      const userId = user.userId || user.id;

      if (!userId) throw new Error("User ID not found");

      const response = await updateInfo(userId, values);

      if (response.data?.code === 200) {
        const updatedUser = { ...user, ...response.data.data };
        onSave(updatedUser);
        dispatch(setUser(updatedUser));
        localStorage.setItem("user", JSON.stringify(updatedUser));
        setSnackbar({
          open: true,
          message: "Dados atualizados com sucesso!",
          severity: "success",
        });
        onClose();
      } else {
        throw new Error(response.data?.message || "Erro ao atualizar dados");
      }
    } catch (error: any) {
      setSnackbar({
        open: true,
        message: error.message || "Erro inesperado",
        severity: "error",
      });
    } finally {
      setLoading(false);
      setSubmitting(false);
    }
  };

  return (
    <>
      <Dialog
        open={open}
        onClose={isCompleting ? undefined : onClose}
        disableEscapeKeyDown={isCompleting}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {isCompleting ? "Completar Cadastro" : "Editar Perfil"}
        </DialogTitle>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
          enableReinitialize
        >
          {({
            values,
            errors,
            touched,
            handleChange,
            handleBlur,
            isSubmitting,
          }) => (
            <Form>
              <DialogContent>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="CPF"
                      name="cpf"
                      fullWidth
                      value={values.cpf}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.cpf && Boolean(errors.cpf)}
                      helperText={touched.cpf && errors.cpf}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Email"
                      name="email"
                      fullWidth
                      value={values.email}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.email && Boolean(errors.email)}
                      helperText={touched.email && errors.email}
                    />
                  </Grid>

                  {/* Nome e sobrenome */}
                  <Grid item xs={12} sm={4}>
                    <TextField
                      label="Nome"
                      name="nome"
                      fullWidth
                      value={values.nome}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.nome && Boolean(errors.nome)}
                      helperText={touched.nome && errors.nome}
                    />
                  </Grid>
                  <Grid item xs={12} sm={5}>
                    <TextField
                      label="Sobrenome"
                      name="sobrenome"
                      fullWidth
                      value={values.sobrenome}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.sobrenome && Boolean(errors.sobrenome)}
                      helperText={touched.sobrenome && errors.sobrenome}
                    />
                  </Grid>

                  {/* Contato */}

                  <Grid item xs={12} sm={3}>
                    <TextField
                      label="Telefone"
                      name="telefone"
                      fullWidth
                      value={values.telefone}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.telefone && Boolean(errors.telefone)}
                      helperText={touched.telefone && errors.telefone}
                    />
                  </Grid>

                  {/* Endereço */}
                  <Grid item xs={12} sm={2}>
                    <TextField
                      label="CEP"
                      name="cep"
                      fullWidth
                      value={values.cep}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.cep && Boolean(errors.cep)}
                      helperText={touched.cep && errors.cep}
                    />
                  </Grid>
                  <Grid item xs={12} sm={7}>
                    <TextField
                      label="Logradouro"
                      name="logradouro"
                      fullWidth
                      value={values.logradouro}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.logradouro && Boolean(errors.logradouro)}
                      helperText={touched.logradouro && errors.logradouro}
                    />
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    <TextField
                      label="Número"
                      name="numero"
                      fullWidth
                      value={values.numero}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.numero && Boolean(errors.numero)}
                      helperText={touched.numero && errors.numero}
                    />
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    <TextField
                      label="Complemento"
                      name="complemento"
                      fullWidth
                      value={values.complemento}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    <TextField
                      label="Bairro"
                      name="bairro"
                      fullWidth
                      value={values.bairro}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.bairro && Boolean(errors.bairro)}
                      helperText={touched.bairro && errors.bairro}
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <TextField
                      label="Cidade"
                      name="cidade"
                      fullWidth
                      value={values.cidade}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.cidade && Boolean(errors.cidade)}
                      helperText={touched.cidade && errors.cidade}
                    />
                  </Grid>
                  <Grid item xs={12} sm={2}>
                    <TextField
                      label="Estado"
                      name="estado"
                      fullWidth
                      value={values.estado}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.estado && Boolean(errors.estado)}
                      helperText={touched.estado && errors.estado}
                    />
                  </Grid>
                </Grid>
              </DialogContent>
              <DialogActions>
                <Button
                  onClick={onClose}
                  disabled={loading || isSubmitting || isCompleting}
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  disabled={loading || isSubmitting || isCompleting}
                >
                  {loading ? <CircularProgress size={24} /> : "Salvar"}
                </Button>
              </DialogActions>
            </Form>
          )}
        </Formik>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};
