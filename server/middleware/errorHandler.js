const errorHandler = (err, req, res, next) => {
  console.error(err.stack);

  let statusCode = 500;
  let message = 'Internal Server Error';

  if (err instanceof multer.MulterError) {
    statusCode = 400;
    message = err.message || 'File upload error';
  } else if (err.code === 'PDF_PARSE_ERROR') {
    statusCode = 422;
    message = 'Failed to parse PDF content';
  } else if (err.code === 'AI_API_ERROR') {
    statusCode = 503;
    message = 'AI service temporarily unavailable';
  } else if (err.message) {
    statusCode = 400;
    message = err.message;
  }

  res.status(statusCode).json({ success: false, error: message });
};

module.exports = errorHandler;