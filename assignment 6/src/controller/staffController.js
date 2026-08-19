const staffService = require("../service/staffService");
const httpStatus = require("../utils/httpStatus");

const registerStaff = async (req, res) => {
  const staff = await staffService.registerStaff(req.body);
  res.status(httpStatus.CREATED).json({ success: true, message: "Staff registered successfully", data: staff });
};

const loginStaff = async (req, res) => {
  const { token, staff } = await staffService.loginStaff(req.body);
  res.cookie("token", token, { httpOnly: true });
  res.status(httpStatus.OK).json({ success: true, message: "Login successful", data: staff });
};

const getMe = async (req, res) => {
  const staff = await staffService.getMe(req.user);
  res.status(httpStatus.OK).json({ success: true, message: "Staff fetched successfully", data: staff });
};

const logoutStaff = async (req, res) => {
  res.clearCookie("token", { httpOnly: true });
  res.status(httpStatus.OK).json({ success: true, message: "Logout successful", data: null });
};

module.exports = {
  registerStaff,
  loginStaff,
  getMe,
  logoutStaff,
};
