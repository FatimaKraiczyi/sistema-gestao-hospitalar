require("dotenv").config();

const express = require("express");
const cors = require("cors");
const { createProxyMiddleware } = require("http-proxy-middleware");
const authenticateToken = require("./middlewares/authenticate");
const authorizeRoles = require("./middlewares/authorize");

const app = express();
const PORT = process.env.PORT || 3333;

const AUTH_MS_URL = process.env.AUTH_MS_URL || "http://auth-service:8081";
const PACIENTE_MS_URL =
  process.env.PACIENTE_MS_URL || "http://paciente-service:8082";

app.use(
  cors({
    origin: "*",
  })
);

// Proxy para Auth Service
app.use(
  "/api/auth",
  createProxyMiddleware({
    target: AUTH_MS_URL,
    changeOrigin: true,
    onProxyReq: (proxyReq, req) => {
      proxyReq.removeHeader("Authorization");
    },
  })
);

// Proxy para Paciente Service (com autenticação e autorização)
app.use(
  "/api/paciente",
  authenticateToken,
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
      if (res.headersSent) return;
      res.status(502).json({
        message: "Erro ao comunicar com o serviço de paciente",
        detail: err.message,
      });
    },
    onProxyRes: (proxyRes, req, res) => {
      // Buffer para acumular dados recebidos do serviço proxied
      let body = Buffer.from("");

      // Escuta os chunks de dados que chegam
      proxyRes.on("data", (data) => {
        body = Buffer.concat([body, data]);
      });

      // Quando a resposta do proxied termina
      proxyRes.on("end", () => {
        // Se o status da resposta indica erro (400 ou mais)
        if (proxyRes.statusCode >= 400) {
          // Repasse o status para o cliente
          res.status(proxyRes.statusCode);

          try {
            // Tente enviar o corpo da resposta convertido para JSON
            res.json(JSON.parse(body.toString()));
          } catch {
            // Se não for JSON válido, envie como texto simples
            res.send(body.toString());
          }
        }
        // Se não for erro, não fazemos nada aqui
        // A resposta padrão será passada normalmente pelo proxy
      });
    },
  })
);

app.listen(PORT, () => {
  console.log(`API Gateway rodando na porta ${PORT}`);
});
