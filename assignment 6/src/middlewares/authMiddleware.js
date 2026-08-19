const jwt = require("jsonwebtoken");

const StaffModel = require("../model/staffModel");
const apiError = require("../utils/apiError");

const authMiddleware = async (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return next(apiError.unauthorized("Token not found"));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const staff = await StaffModel.findById(decoded.id).select("-password");

    if (!staff) {
      return next(apiError.unauthorized("Invalid token"));
    }

    req.user = staff;
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = authMiddleware;
