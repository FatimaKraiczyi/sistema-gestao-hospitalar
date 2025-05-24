const { createProxyMiddleware } = require("http-proxy-middleware");
const express = require("express");
const router = express.Router();

const AUTH_MS_URL = process.env.AUTH_MS_URL;

router.use(
  "/auth",
  createProxyMiddleware({
    target: AUTH_MS_URL,
    changeOrigin: true,
    pathRewrite: { "^/api/auth": "/auth" },
  })
);

module.exports = router;
