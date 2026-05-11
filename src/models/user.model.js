import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      // required: true,
    },
    name: {
      type: String,
      required: true,
      minLength: 3,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    otp: {
      type: String,
    },

    otpExpire: {
      type: Date,
    },
    otpExpire: {
      type: Date,
    },
  },
  { timestamps: true },
);
export const User = mongoose.model("User", userSchema);
