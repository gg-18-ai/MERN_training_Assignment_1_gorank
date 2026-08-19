const apiError = require("../utils/apiError");
const httpStatus = require("../utils/httpStatus");

const notFound = (req, res, next) => {
  next(apiError.createError(httpStatus.NOT_FOUND, `Route not found: ${req.method} ${req.originalUrl}`));
};

const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || httpStatus.INTERNAL_SERVER_ERROR;
  let message = err.message || "Internal server error";
  let errors = err.errors || [];

  if (err.name === "ValidationError") {
    statusCode = httpStatus.BAD_REQUEST;
    message = "Validation failed";
    errors = Object.values(err.errors).map((item) => ({
      field: item.path,
      message: item.message,
    }));
  } else if (err.code === 11000) {
    statusCode = httpStatus.CONFLICT;
    const field = Object.keys(err.keyValue || {})[0] || "field";
    message = `This ${field} already exists`;
    errors = [];
  } else if (err.name === "JsonWebTokenError") {
    statusCode = httpStatus.UNAUTHORIZED;
    message = "Invalid token, please login again";
    errors = [];
  } else if (err.name === "TokenExpiredError") {
    statusCode = httpStatus.UNAUTHORIZED;
    message = "Token expired, please login again";
    errors = [];
  } else if (!err.statusCode) {
    statusCode = httpStatus.INTERNAL_SERVER_ERROR;
    message = "Internal server error";
    errors = [];
  }

  res.status(statusCode).json({
    success: false,
    message,
    ...(errors.length ? { errors } : {}),
    ...(process.env.NODE_ENV === "production" ? {} : { stack: err.stack }),
  });
};

module.exports = {
  notFound,
  errorHandler,
};
