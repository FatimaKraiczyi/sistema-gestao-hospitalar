require("dotenv").config();
const express = require("express");

const app = express();
app.use(express.json());

// Health check
app.get("/", (req, res) => {
  res.send("API Gateway is running 🚀");
});

// Importação das rotas
const authRoutes = require("./routes/auth.routes");
const pacienteRoutes = require("./routes/paciente.routes");
const consultaRoutes = require("./routes/consulta.routes");

// Uso das rotas
app.use("/api", authRoutes);
app.use("/api", pacienteRoutes);
app.use("/api", consultaRoutes);

// Tratamento global de erro
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: "Internal Server Error" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`API Gateway running on port ${PORT}`);
});
