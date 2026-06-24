/**
 * Build a standard API error with status code.
 */
export class ApiError extends Error {
  constructor(statusCode, message, details = null) {
    super(message);
    this.statusCode = statusCode;
    this.details = details;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Async route wrapper — forwards thrown errors to Express error handler.
 */
export const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

/**
 * Global error handler. Should be the last middleware in the chain.
 */
export const errorHandler = (err, _req, res, _next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal Server Error';
  let details = err.details || null;

  // Mongoose: invalid ObjectId
  if (err.name === 'CastError') {
    statusCode = 400;
    message = `Invalid ${err.path}: ${err.value}`;
  }
  // Mongoose: duplicate key
  if (err.code === 11000) {
    statusCode = 409;
    const field = Object.keys(err.keyValue || {})[0] || 'field';
    message = `Duplicate value for ${field}. Already exists.`;
  }
  // Mongoose: validation
  if (err.name === 'ValidationError') {
    statusCode = 422;
    message = 'Validation failed';
    details = Object.values(err.errors).map((e) => e.message);
  }
  // JSON parse
  if (err.type === 'entity.parse.failed') {
    statusCode = 400;
    message = 'Invalid JSON payload';
  }

  if (process.env.NODE_ENV !== 'production') {
    console.error('🔴 Error:', err);
  }

  res.status(statusCode).json({
    success: false,
    message,
    ...(details ? { details } : {}),
    ...(process.env.NODE_ENV !== 'production' ? { stack: err.stack } : {}),
  });
};

/**
 * 404 handler for unmatched routes.
 */
export const notFound = (req, _res, next) => {
  next(new ApiError(404, `Route not found: ${req.method} ${req.originalUrl}`));
};
