const express = require("express");

const staffController = require("../controller/staffController");
const validationMiddleware = require("../middlewares/validationMiddleware");
const authMiddleware = require("../middlewares/authMiddleware");
const {
  registerStaffSchema,
  loginStaffSchema,
} = require("../validationSchema/staffValidationSchema");

const router = express.Router();

router.post("/register", validationMiddleware(registerStaffSchema), staffController.registerStaff);
router.post("/login", validationMiddleware(loginStaffSchema), staffController.loginStaff);
router.get("/me", authMiddleware, staffController.getMe);
router.post("/logout", staffController.logoutStaff);

module.exports = router;
