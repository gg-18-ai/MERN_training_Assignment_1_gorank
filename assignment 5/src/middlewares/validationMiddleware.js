const apiError = require("../utils/apiError");

const validationMiddleware = (schema, property = "body") => {
  return (req, res, next) => {
    const { value, error } = schema.validate(req[property], {
      abortEarly: false,
      stripUnknown: true,
      convert: true,
    });

    if (error) {
      const errors = error.details.map((detail) => ({
        field: detail.path.join("."),
        message: detail.message.replace(/"/g, ""),
      }));

      return next(apiError.badRequest("Validation failed", errors));
    }

    if (property === "query") {
      Object.defineProperty(req, "query", {
        value,
        writable: true,
        configurable: true,
        enumerable: true,
      });
    } else {
      req[property] = value;
    }

    next();
  };
};

module.exports = validationMiddleware;
