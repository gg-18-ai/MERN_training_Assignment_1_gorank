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
  } else if (err.name === "CastError") {
    statusCode = httpStatus.BAD_REQUEST;
    message = `Invalid value for '${err.path}'`;
  } else if (err.code === 11000) {
    statusCode = httpStatus.CONFLICT;
    message = "Duplicate value found";
  }

  res.status(statusCode).json({
    success: false,
    message,
    ...(errors.length ? { errors } : {}),
  });
};

module.exports = {
  notFound,
  errorHandler,
};
