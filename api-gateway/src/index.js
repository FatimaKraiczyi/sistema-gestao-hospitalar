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
    onError: (err, req, res) => {
      // Repasse o erro do microserviço para o client
      if (res.headersSent) return;
      res.status(502).json({
        message: "Erro ao comunicar com o serviço de paciente",
        detail: err.message,
      });
    },
    onProxyRes: (proxyRes, req, res) => {
      // Permite que o corpo de erro do MS seja repassado para o client
      let body = Buffer.from("");
      proxyRes.on("data", function (data) {
        body = Buffer.concat([body, data]);
      });
      proxyRes.on("end", function () {
        if (proxyRes.statusCode >= 400) {
          res.status(proxyRes.statusCode);
          try {
            res.json(JSON.parse(body.toString()));
          } catch {
            res.send(body.toString());
          }
        }
      });
    },
  })
);

app.listen(PORT, () => {
  console.log(`API Gateway rodando na porta ${PORT}`);
});
