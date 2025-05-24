const { createProxyMiddleware } = require("http-proxy-middleware");
const express = require("express");
const authenticateToken = require("../middlewares/authenticate");
const authorizeRoles = require("../middlewares/authorize");

const router = express.Router();
const CONSULTA_MS_URL = process.env.CONSULTA_MS_URL;

router.use(
  "/consulta",
  authenticateToken,
  authorizeRoles("FUNCIONARIO", "PACIENTE"),
  createProxyMiddleware({
    target: CONSULTA_MS_URL,
    changeOrigin: true,
    pathRewrite: { "^/api/consulta": "/consulta" },
    onProxyReq: (proxyReq, req) => {
      if (req.headers.authorization) {
        proxyReq.setHeader("Authorization", req.headers.authorization);
      }
    },
  })
);

module.exports = router;
