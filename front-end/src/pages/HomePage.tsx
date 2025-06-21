import { Container } from "@mui/material";
import Hero from "../components/home/Hero.tsx";
import Navbar from "../components/home/Navbar.tsx";
import { useEffect } from "react";
import { useNavigate } from "react-router";
import { ROUTING } from "../constants/routing";

function HomePage() {
  const navigate = useNavigate();

  useEffect(() => {
    // Kiểm tra xem người dùng đã đăng nhập chưa
    const type = localStorage.getItem("type");

    if (type) {
      // Người dùng đã đăng nhập, chuyển hướng dựa trên vai trò
      if (type === "FUNCIONARIO") {
        navigate(ROUTING.FUNCIONARIO);
      } else if (type === "PACIENTE") {
        navigate(ROUTING.PACIENTE);
      } else {
        navigate(ROUTING.ADMIN);
      }
    }
    // Nếu không có người dùng hoặc vai trò, ở lại trang chủ
  }, [navigate]);

  return (
    <Container maxWidth={false} disableGutters={true}>
      <Navbar />
      <Hero />
    </Container>
  );
}

export default HomePage;
