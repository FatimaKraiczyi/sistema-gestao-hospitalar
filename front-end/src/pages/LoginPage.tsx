import { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Grid2 } from "@mui/material";
import {
  Box,
  Container,
  TextField,
  Button,
  Typography,
  Link,
  IconButton,
  InputAdornment,
  CircularProgress,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router";
import { login } from "../services/authenticate/auth_service";
import { setUser } from "../stores/slices/user.slice";
import { toast } from "react-toastify";
import { ROUTING } from "../constants/routing";
import { jwtDecode } from "jwt-decode";
import { getPatientInfo } from "../services/authenticate/user_service";

interface DecodedToken {
  email: string;
  cpf: string;
  type: string;
  sub: string; // id
}

const validationSchema = Yup.object({
  email: Yup.string().email("E-mail inválido").required("E-mail é obrigatório"),
  password: Yup.string()
    .min(4, "A senha tem pelo menos 4 caracteres")
    .max(20, "A senha não pode ter mais de 20 caracteres")
    .required("Senha é obrigatória"),
});

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      try {
        setIsLoading(true);
        const response = await login(values.email, values.password);

        if (response.status === 200) {
          const token = response.data.token;
          localStorage.setItem("token", token);

          const decoded: DecodedToken = jwtDecode(token);
          const userData = {
            email: decoded.email,
            cpf: decoded.cpf,
            id: decoded.sub,
            type: decoded.type,
          };

          dispatch(setUser(userData));
          localStorage.setItem("type", userData.type);

          toast.success("Login realizado com sucesso!");

          // Verifica tipo de usuário
          if (userData.type === "PACIENTE") {
            try {
              const patientResponse = await getPatientInfo(userData.id);

              if (patientResponse?.data?.code === 200) {
                // Paciente já existe → vai para layout principal
                dispatch(
                  setUser({
                    ...userData,
                    ...patientResponse.data.data, // nome, telefone, etc
                  })
                );
                setTimeout(() => navigate(ROUTING.PACIENTE), 1000);
              } else {
                // Fallback
                setTimeout(() => navigate(ROUTING.PROFILE), 1000);
              }
            } catch {
              if (response?.data.code === 404) {
                // Paciente não encontrado → precisa completar cadastro
                setTimeout(() => navigate(ROUTING.PROFILE), 1000);
              } else {
                console.error("Erro ao buscar paciente:");
                toast.error("Erro ao verificar informações do paciente.");
              }
            }
          } else if (userData.type === "FUNCIONARIO") {
            setTimeout(() => navigate(ROUTING.FUNCIONARIO), 1000);
          } else {
            setTimeout(() => navigate(ROUTING.ADMIN), 1000);
          }
        } else {
          toast.error("Falha no login. Verifique suas credenciais.");
        }
      } catch (error) {
        console.error("Erro ao fazer login:", error);
        toast.error("Erro ao fazer login. Tente novamente mais tarde.");
      } finally {
        setIsLoading(false);
      }
    },
  });

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
          Bem-vindo
        </Typography>
        <Typography variant="body2" align="center" sx={{ mb: 3 }}>
          Ainda não tem uma conta? <Link href="/register">Crie uma conta</Link>
        </Typography>

        <form onSubmit={formik.handleSubmit}>
          <Grid2 container spacing={2}>
            <Grid2 size={{ xs: 12 }}>
              <TextField
                fullWidth
                id="email"
                name="email"
                label="E-mail"
                value={formik.values.email}
                onChange={formik.handleChange}
                error={formik.touched.email && Boolean(formik.errors.email)}
                helperText={formik.touched.email && formik.errors.email}
                disabled={isLoading}
              />
            </Grid2>
            <Grid2 size={{ xs: 12 }}>
              <TextField
                fullWidth
                id="password"
                name="password"
                label="Senha"
                type={showPassword ? "text" : "password"}
                value={formik.values.password}
                onChange={formik.handleChange}
                error={
                  formik.touched.password && Boolean(formik.errors.password)
                }
                helperText={formik.touched.password && formik.errors.password}
                disabled={isLoading}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                        disabled={isLoading}
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Grid2>

            <Grid2 size={{ xs: 12 }}>
              <Link
                href={ROUTING.FORGET_PASSWORD}
                sx={{
                  display: "block",
                  textAlign: "right",
                  mb: 1,
                }}
              >
                Esqueceu a senha?
              </Link>
            </Grid2>

            <Grid2 size={{ xs: 12 }}>
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
              >
                {isLoading ? "Entrando..." : "Entrar"}
              </Button>
            </Grid2>
          </Grid2>
        </form>
      </Box>
    </Container>
  );
}
