require('dotenv').config();

module.exports = {
  port: process.env.PORT || 3000,
  consultaServiceUrl: process.env.CONSULTA_SERVICE_URL,
  authServiceUrl: process.env.AUTH_SERVICE_URL,
  pacienteServiceUrl: process.env.PACIENTE_SERVICE_URL,
  jwtSecret: process.env.JWT_SECRET,
};
