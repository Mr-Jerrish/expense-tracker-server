import bcryptjs from "bcryptjs";
import { User } from "../../models/user.model.js";
import { sendMail } from "../../utils/sendMail.js";
export const registerUserService = async (data) => {
  const { name, email, password } = data;

  const existingUser = await User.findOne({
    email,
  });
  if (existingUser) {
    throw new Error("User already exists");
  }
  const hashedPassword = await bcryptjs.hash(password, 10);
  const user = await User.create({
    name,
    email,
    password: hashedPassword,
  });
  return user;
};

export const loginUserService = async (data) => {
  const { email, password } = data;

  const user = await User.findOne({
    email,
  });
  if (!user) {
    throw new Error("User not found");
  }
  const isPasswordMatch = await bcryptjs.compare(password, user.password);
  if (!isPasswordMatch) {
    throw new Error("Invalid password");
  }
  return user;
};

// export const forgotPasswordSerive = async (email) => {
//   const user = await User.findOne({ email });
//   if (!user) {
//     throw new Error("User not found");
//   }
//   const otp = Math.floor(100000 + Math.random() * 900000).toString();
//   user.otp = otp;
//   await user.save();
//   await sendMail(email, otp);
//   return true;
// };

export const forgotPasswordSerive = async (email) => {
  const user = await User.findOne({ email });

  if (!user) {
    throw new Error("User not found");
  }

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  user.otp = otp;
  user.otpExpire = Date.now() + 3 * 60 * 1000;
  await user.save();
  await sendMail(email, otp);
  return true;
};

export const verifyOtpService = async (email, otp) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error("User not found");
  }
  if (user.otp !== otp) {
    throw new Error("Invalid OTP");
  }
  // Check Expiry
  if (user.otpExpire < Date.now()) {
    throw new Error("OTP Expired");
  }
  return true;
};

export const resetPasswordService = async (email, otp, newPassword) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error("User not found");
  }
  // Check OTP
  // if (user.otp !== otp) {
  //   throw new Error("Invalid OTP");
  // }
  const enteredOtp = Array.isArray(otp) ? otp.join("") : otp;
  if (user.otpExpire < Date.now()) {
    throw new Error("OTP Expired");
  }
  if (user.otp !== enteredOtp) {
    throw new Error("Invalid OTP");
  }
  if (user.otpExpire < Date.now()) {
    throw new Error("OTP Expired");
  }
  const hashedPassword = await bcryptjs.hash(newPassword, 10);
  user.password = hashedPassword;
  user.otp = null;
  user.otpExpire = null;
  await user.save();
  return true;
};

export const resendOtpService = async (email) => {
  const user = await User.findOne({ email });

  if (!user) {
    throw new Error("User not found");
  }

  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  user.otp = otp;

  user.otpExpire = Date.now() + 3 * 60 * 1000;

  await user.save();

  await sendMail(email, otp);

  return true;
};
