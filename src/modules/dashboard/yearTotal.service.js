import { Income } from "../../models/income.models.js";
import { Expense } from "../../models/expense.model.js";
import { getFYDateRange } from "../../utils/financialYear.js";
import mongoose from "mongoose";

export const totalYearService = async ({ userId, financialYear }) => {
  const { startDate, endDate } = getFYDateRange(financialYear);

  const incomeResult = await Income.aggregate([
    {
      $match: {
        userId: new mongoose.Types.ObjectId(userId),
        date: { $gte: startDate, $lte: endDate },
      },
    },
    {
      $group: {
        _id: null,
        totalIncome: { $sum: "$amount" },
      },
    },
  ]);

  // 🔹 Expense
  const expenseResult = await Expense.aggregate([
    {
      $match: {
        userId: new mongoose.Types.ObjectId(userId),
        date: { $gte: startDate, $lte: endDate },
      },
    },
    {
      $group: {
        _id: null,
        totalExpense: { $sum: "$amount" },
      },
    },
  ]);

  // 🔹 Safe values
  const totalIncome = incomeResult[0]?.totalIncome || 0;
  const totalExpense = expenseResult[0]?.totalExpense || 0;

  const balance = totalIncome - totalExpense;

  return {
    totalIncome,
    totalExpense,
    balance,
  };
};

export const totalMonthService = async ({ userId, financialYear }) => {
  const { startDate, endDate } = getFYDateRange(financialYear);

  const fyMonths = [4, 5, 6, 7, 8, 9, 10, 11, 12, 1, 2, 3];

  const monthNames = [
    "",
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  // 🔹 Income
  const resultIncome = await Income.aggregate([
    {
      $match: {
        userId: new mongoose.Types.ObjectId(userId),
        date: { $gte: startDate, $lte: endDate },
      },
    },
    {
      $group: {
        _id: { $month: "$date" },
        totalIncome: { $sum: "$amount" },
      },
    },
  ]);

  // 🔹 Expense
  const resultExpense = await Expense.aggregate([
    {
      $match: {
        userId: new mongoose.Types.ObjectId(userId),
        date: { $gte: startDate, $lte: endDate },
      },
    },
    {
      $group: {
        _id: { $month: "$date" },
        totalExpense: { $sum: "$amount" },
      },
    },
  ]);

  // 🔥 Merge both
  const monthlyData = fyMonths.map((month) => {
    const income = resultIncome.find((i) => i._id === month);
    const expense = resultExpense.find((e) => e._id === month);

    const totalIncome = income?.totalIncome || 0;
    const totalExpense = expense?.totalExpense || 0;

    return {
      month: monthNames[month],
      income: totalIncome,
      expense: totalExpense,
      balance: totalIncome - totalExpense,
    };
  });

  return monthlyData;
};
