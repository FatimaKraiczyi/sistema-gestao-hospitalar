const { createProxyMiddleware } = require("http-proxy-middleware");
const express = require("express");
const authenticateToken = require("../middlewares/authenticate");
const authorizeRoles = require("../middlewares/authorize");

const router = express.Router();
const PACIENTE_MS_URL = process.env.PACIENTE_MS_URL;

router.use(
  "/paciente",
  authenticateToken,
  authorizeRoles("PACIENTE"),
  createProxyMiddleware({
    target: PACIENTE_MS_URL,
    changeOrigin: true,
    pathRewrite: { "^/api/paciente": "/paciente" },
    onProxyReq: (proxyReq, req) => {
      if (req.headers.authorization) {
        proxyReq.setHeader("Authorization", req.headers.authorization);
      }
    },
  })
);

module.exports = router;
