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
  FormControlLabel,
  RadioGroup,
  Radio,
  FormControl,
  FormLabel,
  IconButton,
  InputAdornment,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { signUp } from "../services/authenticate/auth_service";
import { useNavigate } from "react-router";
import { formatDateToString } from "../utils/dateUtils";
import { toast } from "react-toastify";
import { ROUTING } from "../constants/routing";

// Validação dos dados de entrada para o formulário de cadastro
const validationSchema = Yup.object({
  firstName: Yup.string()
    .required("Nome é obrigatório")
    .min(2, "Nome deve ter pelo menos 2 caracteres"),
  lastName: Yup.string()
    .required("Sobrenome é obrigatório")
    .min(2, "Sobrenome deve ter pelo menos 2 caracteres"),
  username: Yup.string()
    .required("Nome de usuário é obrigatório")
    .min(3, "Nome de usuário deve ter pelo menos 3 caracteres"),
  email: Yup.string().email("E-mail inválido").required("E-mail é obrigatório"),
  phone: Yup.string()
    .matches(/^[0-9]+$/, "O telefone deve conter apenas números")
    .min(10, "O telefone deve ter pelo menos 10 dígitos")
    .required("Telefone é obrigatório"),
  password: Yup.string()
    .min(8, "A senha deve ter pelo menos 8 caracteres")
    .max(20, "A senha não pode ter mais de 20 caracteres")
    .required("Senha é obrigatória"),
  birthDate: Yup.date()
    .max(new Date(), "A data de nascimento não pode ser no futuro")
    .required("Data de nascimento é obrigatória"),
  gender: Yup.string().required("Gênero é obrigatório"),
  rememberMe: Yup.boolean(),
});

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      firstName: "",
      lastName: "",
      username: "",
      email: "",
      phone: "",
      password: "",
      birthDate: "",
      gender: "female",
      rememberMe: false,
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      try {
        const isFemale = values.gender === "female";
        const birthDate = new Date(values.birthDate);
        const response = await signUp(
          values.firstName,
          values.lastName,
          values.email,
          values.password,
          values.username,
          isFemale,
          formatDateToString(birthDate),
          values.phone
        );
        if (response.status === 200 && response.data.code === 200) {
          toast.success("Conta criada com sucesso!");
          setTimeout(() => navigate(ROUTING.LOGIN), 2000);
        } else {
          toast.error(response.data.message || "Falha ao cadastrar");
        }
      } catch (error) {
        console.error("Erro ao cadastrar:", error);
        toast.error("Ocorreu um erro durante o cadastro");
      }
    },
  });

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          p: 3,
          mt: 4,
          boxShadow: 3,
          borderRadius: 2,
          backgroundColor: "background.paper",
        }}
      >
        <Typography variant="h5" align="center" gutterBottom>
          Criar conta
        </Typography>
        <Typography variant="body2" align="center" sx={{ mb: 3 }}>
          Já tem uma conta? <Link href="/login">Entrar</Link>
        </Typography>
        <form onSubmit={formik.handleSubmit}>
          <Grid2 container spacing={2}>
            <Grid2 size={{ xs: 6 }}>
              <TextField
                fullWidth
                id="firstName"
                name="firstName"
                label="Nome"
                value={formik.values.firstName}
                onChange={formik.handleChange}
                error={
                  formik.touched.firstName && Boolean(formik.errors.firstName)
                }
                helperText={formik.touched.firstName && formik.errors.firstName}
              />
            </Grid2>
            <Grid2 size={{ xs: 6 }}>
              <TextField
                fullWidth
                id="lastName"
                name="lastName"
                label="Sobrenome"
                value={formik.values.lastName}
                onChange={formik.handleChange}
                error={
                  formik.touched.lastName && Boolean(formik.errors.lastName)
                }
                helperText={formik.touched.lastName && formik.errors.lastName}
              />
            </Grid2>
            <Grid2 size={{ xs: 12 }}>
              <TextField
                fullWidth
                id="username"
                name="username"
                label="Nome de usuário"
                value={formik.values.username}
                onChange={formik.handleChange}
                error={
                  formik.touched.username && Boolean(formik.errors.username)
                }
                helperText={formik.touched.username && formik.errors.username}
              />
            </Grid2>
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
              />
            </Grid2>
            <Grid2 size={{ xs: 12 }}>
              <TextField
                fullWidth
                id="phone"
                name="phone"
                label="Telefone"
                value={formik.values.phone}
                onChange={formik.handleChange}
                error={formik.touched.phone && Boolean(formik.errors.phone)}
                helperText={formik.touched.phone && formik.errors.phone}
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
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Grid2>
            <Grid2 size={{ xs: 6 }}>
              <TextField
                fullWidth
                id="birthDate"
                name="birthDate"
                label="Data de nascimento"
                type="date"
                value={formik.values.birthDate}
                onChange={formik.handleChange}
                error={
                  formik.touched.birthDate && Boolean(formik.errors.birthDate)
                }
                helperText={formik.touched.birthDate && formik.errors.birthDate}
                InputLabelProps={{ shrink: true }}
              />
            </Grid2>
            <Grid2 size={{ xs: 6 }}>
              <FormControl fullWidth>
                <FormLabel>Gênero</FormLabel>
                <RadioGroup
                  row
                  name="gender"
                  value={formik.values.gender}
                  onChange={formik.handleChange}
                >
                  <FormControlLabel
                    value="female"
                    control={<Radio />}
                    label="Feminino"
                  />
                  <FormControlLabel
                    value="male"
                    control={<Radio />}
                    label="Masculino"
                  />
                </RadioGroup>
              </FormControl>
            </Grid2>
            <Grid2 size={{ xs: 12 }}>
              <Button
                fullWidth
                variant="contained"
                color="primary"
                type="submit"
                size="large"
                sx={{ mt: 1 }}
              >
                Cadastrar
              </Button>
            </Grid2>
          </Grid2>
        </form>
      </Box>
    </Container>
  );
}
