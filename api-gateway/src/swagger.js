const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Hospital Management API Gateway',
      version: '1.0.0',
      description: 'Documentação do API Gateway do Sistema de Gestão Hospitalar'
    },
    servers: [
      {
        url: 'http://localhost:3000', // troque para a porta usada
        description: 'Servidor local'
      }
    ]
  },
  apis: ['./src/routes/*.js'], // ou './routes/*.js', dependendo da sua estrutura
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = {
  swaggerUi,
  swaggerSpec
};
