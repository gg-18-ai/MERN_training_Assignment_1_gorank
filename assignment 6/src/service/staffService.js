const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const StaffModel = require("../model/staffModel");
const apiError = require("../utils/apiError");

const registerStaff = async (data) => {
  const existingStaff = await StaffModel.findOne({ email: data.email.toLowerCase() });

  if (existingStaff) {
    throw apiError.conflict("This email already exists");
  }

  const staff = await StaffModel.create(data);
  const staffObject = staff.toObject();
  delete staffObject.password;

  return staffObject;
};

const loginStaff = async (data) => {
  const staff = await StaffModel.findOne({ email: data.email.toLowerCase() });

  if (!staff) {
    throw apiError.unauthorized("Invalid email or password");
  }

  const isMatch = await bcrypt.compare(data.password, staff.password);

  if (!isMatch) {
    throw apiError.unauthorized("Invalid email or password");
  }

  const token = jwt.sign(
    { id: staff._id, department: staff.department },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );

  const staffObject = staff.toObject();
  delete staffObject.password;

  return {
    token,
    staff: staffObject,
  };
};

const getMe = async (staff) => {
  return staff;
};

module.exports = {
  registerStaff,
  loginStaff,
  getMe,
};
