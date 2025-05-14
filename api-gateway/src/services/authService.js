const axios = require('axios');
const config = require('../config/config');

const requestAuthService = async (method, endpoint, data) => {
  const url = `${config.authServiceUrl}${endpoint}`;
  return axios({ method, url, data });
};

module.exports = requestAuthService;