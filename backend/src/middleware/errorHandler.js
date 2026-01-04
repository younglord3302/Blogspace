// Last middleware in the chain
const errorHandler = (err, req, res, next) => {
  console.error('❌ Error:', err);

  if (res.headersSent) {
    return next(err);
  }

  const status = err.status || 500;
  res.status(status).json({
    error: err.message || 'Internal server error'
  });
};

module.exports = errorHandler;
