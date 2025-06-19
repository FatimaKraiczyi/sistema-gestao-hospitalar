import { Box, Container, Grid2, Typography, Link } from "@mui/material";
import Logo from "./Logo";

export default function Footer() {
  return (
    <Box sx={{ bgcolor: "primary.main", color: "white", py: 6 }}>
      <Container>
        <Grid2 container spacing={4}>
          <Grid2 size={{ xs: 12, md: 4 }}>
            <Logo />
            <Typography variant="body2" sx={{ mt: 2 }}>
              Oferecendo serviços de saúde de qualidade para um futuro melhor.
            </Typography>
          </Grid2>
          <Grid2 size={{ xs: 12, md: 2 }}>
            <Typography variant="h6" gutterBottom>
              Empresa
            </Typography>
            <Link href="#" color="inherit" display="block">
              Sobre Nós
            </Link>
            <Link href="#" color="inherit" display="block">
              Trabalhe Conosco
            </Link>
            <Link href="#" color="inherit" display="block">
              Contato
            </Link>
          </Grid2>
          <Grid2 size={{ xs: 12, md: 2 }}>
            <Typography variant="h6" gutterBottom>
              Serviços
            </Typography>
            <Link href="#" color="inherit" display="block">
              Agendamentos
            </Link>
            <Link href="#" color="inherit" display="block">
              Tratamentos
            </Link>
            <Link href="#" color="inherit" display="block">
              Especialistas
            </Link>
          </Grid2>
          <Grid2 size={{ xs: 12, md: 2 }}>
            <Typography variant="h6" gutterBottom>
              Recursos
            </Typography>
            <Link href="#" color="inherit" display="block">
              Blog
            </Link>
            <Link href="#" color="inherit" display="block">
              Notícias
            </Link>
            <Link href="#" color="inherit" display="block">
              Perguntas Frequentes
            </Link>
          </Grid2>
          <Grid2 size={{ xs: 12, md: 2 }}>
            <Typography variant="h6" gutterBottom>
              Jurídico
            </Typography>
            <Link href="#" color="inherit" display="block">
              Privacidade
            </Link>
            <Link href="#" color="inherit" display="block">
              Termos de Uso
            </Link>
            <Link href="#" color="inherit" display="block">
              Política de Cookies
            </Link>
          </Grid2>
        </Grid2>
      </Container>
    </Box>
  );
}
