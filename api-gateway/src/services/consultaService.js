const axios = require('axios')
const config = require('../config/config')

const requestConsultaService = async (method, endpoint, data, headers) => {
  const url = `${config.consultaServiceUrl}${endpoint}`
  return axios({ method, url, data, headers })
}

module.exports = requestConsultaService
