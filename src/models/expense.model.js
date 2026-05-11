import mongoose from "mongoose";

const expenseSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    expenseSource: {
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
export const Expense = mongoose.model("Expense", expenseSchema);
