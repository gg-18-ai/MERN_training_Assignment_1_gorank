const joi = require("joi");

const registerStaffSchema = joi.object({
  name: joi.string().trim().min(2).max(50).required(),
  email: joi.string().trim().email().required(),
  password: joi.string().min(6).required(),
  department: joi.string().valid("sales", "support", "warehouse").required(),
});

const loginStaffSchema = joi.object({
  email: joi.string().trim().email().required(),
  password: joi.string().min(6).required(),
});

module.exports = {
  registerStaffSchema,
  loginStaffSchema,
};
