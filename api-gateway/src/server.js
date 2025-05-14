const app = require('./app');
const config = require('./config/config');

// Iniciar o servidor
app.listen(config.port, () => {
  console.log(`API Gateway running on port ${config.port}`);
});