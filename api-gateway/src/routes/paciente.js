const express = require("express");
const axios = require("axios");
const router = express.Router();

const PACIENTE_SERVICE_URL = process.env.PACIENTE_MS_URL;

const authenticateToken = require("../middlewares/authenticate");
const authorizeRoles = require("../middlewares/authorize");

router.post(
  "/paciente/cadastro",
  authenticateToken,
  authorizeRoles("PACIENTE"),
  async (req, res, next) => {
    try {
      const { id, cpf, email } = req.user;

      const payload = {
        id,
        cpf,
        email,
        ...req.body,
      };

      const response = await axios.post(
        `${PACIENTE_SERVICE_URL}/paciente`,
        payload,
        {
          headers: { Authorization: req.headers.authorization },
        }
      );

      res.status(response.status).json(response.data);
    } catch (err) {
      next(err);
    }
  }
);

module.exports = router;
