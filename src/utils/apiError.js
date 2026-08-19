const createError = (statusCode, message, errors = []) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  error.errors = errors;
  return error;
};

const badRequest = (message = "Bad request", errors = []) => createError(400, message, errors);
const unauthorized = (message = "Please login first") => createError(401, message);
const forbidden = (message = "You are not allowed to perform this action") =>
  createError(403, message);
const notFound = (resource = "Resource") => createError(404, `${resource} not found`);
const conflict = (message = "Already exists") => createError(409, message);

module.exports = {
  createError,
  badRequest,
  unauthorized,
  forbidden,
  notFound,
  conflict,
};
