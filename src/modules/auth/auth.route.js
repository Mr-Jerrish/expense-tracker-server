import express from "express";
import {
  registerUser,
  loginUser,
  forgotPassword,
  verifyOtp,
  resetPassword,
  resendOtp,
} from "./auth.controller.js";
import { validate } from "../../middleware/validate.middleware.js";
import { registerUserSchema, loginUserSchema } from "./auth.validation.js";
const router = express.Router();

router.post("/register", validate(registerUserSchema), registerUser);
router.post("/login", validate(loginUserSchema), loginUser);
router.post("/forgot-password", forgotPassword);
router.post("/verify-otp", verifyOtp);
router.put("/reset-password", resetPassword);
router.post("/resend-otp", resendOtp);

export default router;
