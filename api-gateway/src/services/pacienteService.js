const axios = require('axios');
const config = require('../config/config');

const requestPacienteService = async (method, endpoint, data, headers) => {
  const url = `${config.pacienteServiceUrl}${endpoint}`; 
  return axios({ method, url, data, headers });
};

module.exports = requestPacienteService;
