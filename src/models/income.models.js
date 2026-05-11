import mongoose from "mongoose";

const incomeSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    incomeSource: {
      type: String,
      required: true,
      minLength: 3,
    },
    category: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    paymentMethod: {
      type: String,
      required: true,
    },
    account: {
      type: String,
    },
    transactionId: {
      type: String,
    },
    description: {
      type: String,
    },
    financialYear: {
      type: String,
      // required: true,
    },
  },
  { timestamps: true },
);
export const Income = mongoose.model("Income", incomeSchema);
