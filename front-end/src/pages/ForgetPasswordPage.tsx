import { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  Box,
  Container,
  TextField,
  Button,
  Typography,
  Link,
  CircularProgress,
  Paper,
} from "@mui/material";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import { ROUTING } from "../constants/routing";
import { resetPassword } from "../services/authenticate/auth_service";
import { ApiError } from "../types";

// Definição do schema de validação
const validationSchema = Yup.object({
  email: Yup.string()
    .email("Endereço de e-mail inválido")
    .required("E-mail é obrigatório"),
});

export default function ForgetPasswordPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      email: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      try {
        setIsLoading(true);
        const response = await resetPassword(values.email);

        if (response.data.code === 200 && response.data.data === true) {
          setIsSubmitted(true);

          toast.success(response.data.message);
        } else {
          toast.error(response.data.message);
        }
      } catch (error: unknown) {
        const err = error as ApiError;
        toast.error(err.message);
      } finally {
        setIsLoading(false);
      }
    },
  });

  if (isSubmitted) {
    return (
      <Container maxWidth="sm">
        <Paper elevation={3} sx={{ p: 4, mt: 8, textAlign: "center" }}>
          <Typography variant="h5" gutterBottom>
            Solicitação de redefinição de senha enviada!
          </Typography>
          <Typography variant="body1" paragraph>
            Enviamos uma nova senha para o e-mail {formik.values.email}. Por
            favor, verifique sua caixa de entrada.
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate(ROUTING.LOGIN)}
            sx={{ mt: 2 }}
          >
            Voltar para a tela de login
          </Button>
        </Paper>
      </Container>
    );
  }

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          p: 3,
          mt: 8,
          boxShadow: 3,
          borderRadius: 2,
          backgroundColor: "background.paper",
        }}
      >
        <Typography variant="h5" align="center" gutterBottom>
          Esqueceu a senha
        </Typography>
        <Typography variant="body2" align="center" sx={{ mb: 3 }}>
          Informe seu e-mail para receber uma nova senha
        </Typography>

        <form onSubmit={formik.handleSubmit}>
          <TextField
            fullWidth
            id="email"
            name="email"
            label="Endereço de E-mail"
            value={formik.values.email}
            onChange={formik.handleChange}
            error={formik.touched.email && Boolean(formik.errors.email)}
            helperText={formik.touched.email && formik.errors.email}
            disabled={isLoading}
            margin="normal"
          />

          <Button
            fullWidth
            variant="contained"
            color="primary"
            type="submit"
            size="large"
            disabled={isLoading}
            startIcon={
              isLoading && <CircularProgress size={24} color="inherit" />
            }
            sx={{ mt: 3, mb: 2 }}
          >
            {isLoading ? "Processando..." : "Enviar solicitação"}
          </Button>

          <Typography align="center">
            <Link href={ROUTING.LOGIN} variant="body2">
              Voltar para login
            </Link>
          </Typography>
        </form>
      </Box>
    </Container>
  );
}
