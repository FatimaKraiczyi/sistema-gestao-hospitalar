require("dotenv").config();

const express = require("express");
const { createProxyMiddleware } = require("http-proxy-middleware");
const authenticateToken = require("./middlewares/authenticate");
const authorizeRoles = require("./middlewares/authorize");

const app = express();
const PORT = process.env.PORT || 3000;

const AUTH_MS_URL = process.env.AUTH_MS_URL || "http://auth-service:8081";
const PACIENTE_MS_URL =
  process.env.PACIENTE_MS_URL || "http://paciente-service:8082";

// Proxy para Auth Service
app.use(
  "/api/auth",
  createProxyMiddleware({
    target: AUTH_MS_URL,
    changeOrigin: true,
    onProxyReq: (proxyReq, req) => {
      // Removendo o cabeçalho Authorization
      proxyReq.removeHeader("Authorization");
    },
  })
);

// Proxy para Paciente Service (com autenticação obrigatória e validação de autorização)
app.use(
  "/api/paciente",
  authenticateToken, // valida o JWT
  authorizeRoles("PACIENTE"),
  createProxyMiddleware({
    target: PACIENTE_MS_URL,
    changeOrigin: true,
    onProxyReq: (proxyReq, req) => {
      proxyReq.setHeader("Authorization", req.headers["authorization"]);
      proxyReq.setHeader("x-user-id", req.user.id);
      proxyReq.setHeader("x-user-cpf", req.user.cpf);
      proxyReq.setHeader("x-user-email", req.user.email);
      proxyReq.setHeader("x-user-type", req.user.type);
    },
  })
);

app.listen(PORT, () => {
  console.log(`API Gateway rodando na porta ${PORT}`);
});
