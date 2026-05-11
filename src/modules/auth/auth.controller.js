import {
  registerUserService,
  loginUserService,
  forgotPasswordSerive,
  verifyOtpService,
  resetPasswordService,
  resendOtpService,
} from "../auth/auth.service.js";
import {
  sendErrorResponse,
  sendSuccessResponse,
} from "../../utils/ApiResponse.js";
import { generateToken } from "../../../src/utils/generateToken.js";

export const registerUser = async (req, res) => {
  try {
    const user = await registerUserService(req.body);
    return sendSuccessResponse(res, {
      key: "User",
      data: {
        user,
      },
      message: "User created successfully",
      statusCode: 201,
    });
  } catch (error) {
    return sendErrorResponse(res, {
      key: "User",
      data: {},
      message: error.message,
      statusCode: 400,
    });
  }
};

export const loginUser = async (req, res) => {
  try {
    const user = await loginUserService(req.body);
    const token = generateToken(user._id);
    return sendSuccessResponse(res, {
      key: "User",
      data: {
        user,
        token,
      },
      message: "User logged in successfully",
      statusCode: 200,
    });
  } catch (error) {
    return sendErrorResponse(res, {
      key: "User",
      data: {},
      message: error.message,
      statusCode: 400,
    });
  }
};

export const forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await forgotPasswordSerive(email);
    return sendSuccessResponse(res, {
      key: "User",
      data: {
        user,
      },
      message: "OTP sent to your email",
      statusCode: 200,
    });
  } catch (error) {
    return sendErrorResponse(res, {
      key: "User",
      data: {},
      message: error.message,
      statusCode: 400,
    });
  }
};

export const verifyOtp = async (req, res) => {
  const { email, otp } = req.body;
  try {
    const user = await verifyOtpService(email, otp);
    return sendSuccessResponse(res, {
      key: "User",
      data: {
        user,
      },
      message: "OTP sent to your email",
      statusCode: 200,
    });
  } catch (error) {
    return sendErrorResponse(res, {
      key: "User",
      data: {},
      message: error.message,
      statusCode: 400,
    });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    await resetPasswordService(email, otp, newPassword);

    return sendSuccessResponse(res, {
      key: "User",
      data: {},
      message: "Password reset successfully",
      statusCode: 200,
    });
  } catch (error) {
    return sendErrorResponse(res, {
      key: "User",
      data: {},
      message: error.message,
      statusCode: 400,
    });
  }
};

export const resendOtp = async (req, res) => {
  try {
    const { email } = req.body;

    await resendOtpService(email);

    return sendSuccessResponse(res, {
      key: "User",
      data: {},
      message: "OTP resent successfully",
      statusCode: 200,
    });
  } catch (error) {
    return sendErrorResponse(res, {
      key: "User",
      data: {},
      message: error.message,
      statusCode: 400,
    });
  }
};
