const errorHandler = (err, req, res, next) => {
  const status = err.response?.status || 500;
  const message = err.response?.data || { error: 'Service Error' };
  res.status(status).json(message);
};

module.exports = errorHandler;