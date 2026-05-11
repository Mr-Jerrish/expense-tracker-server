import { Expense } from "../../models/expense.model.js";
import { getFYDateRange, getFinancialYear } from "../../utils/financialYear.js";
import mongoose from "mongoose";

export const createExpenseService = async (data, userId) => {
  const {
    id,
    expenseSource,
    category,
    amount,
    date,
    paymentMethod,
    account,
    transactionId,
    description,
  } = data;

  const financialYear = getFinancialYear(date);

  if (id) {
    const expense = await Expense.findById(id);
    if (!expense) throw new Error("Expense not found");

    expense.expenseSource = expenseSource;
    expense.category = category;
    expense.amount = amount;
    expense.date = date;
    expense.paymentMethod = paymentMethod;
    expense.account = account;
    expense.transactionId = transactionId;
    expense.description = description;
    expense.financialYear = financialYear;

    return await expense.save();
  }

  return await new Expense({
    userId,
    expenseSource,
    category,
    amount,
    date,
    paymentMethod,
    account,
    transactionId,
    description,
    financialYear,
  }).save();
};

export const getExpenseByIdService = async (id, userId) => {
  const expense = await Expense.findById(id);
  if (!expense) throw new Error("Expense not found");
  if (!expense.userId.equals(userId)) {
    throw new Error("Not authorized");
  }
  return expense;
};

export const getAllExpenseService = async ({ userId, financialYear }) => {
  const query = { userId };
  if (financialYear) {
    const { startDate, endDate } = getFYDateRange(financialYear);
    query.date = { $gte: startDate, $lte: endDate };
  }
  return await Expense.find(query).sort({ date: -1 });
};

export const totalExpenseService = async ({ userId, financialYear }) => {
  const { startDate, endDate } = getFYDateRange(financialYear);

  const today = new Date();

  const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);

  const startOfToday = new Date(today.setHours(0, 0, 0, 0));
  const endOfToday = new Date(today.setHours(23, 59, 59, 999));

  const result = await Expense.aggregate([
    {
      $match: {
        userId: new mongoose.Types.ObjectId(userId),
        date: {
          $gte: startDate,
          $lte: endDate,
        },
      },
    },
    {
      $group: {
        _id: "$category",
        total: { $sum: "$amount" },
        count: { $sum: 1 },
      },
    },
    {
      $limit: 4,
    },
  ]);

  const yearExpense = result.reduce((sum, item) => sum + item.total, 0);

  const monthData = await Expense.aggregate([
    {
      $match: {
        userId: new mongoose.Types.ObjectId(userId),
        date: {
          $gte: startOfMonth > startDate ? startOfMonth : startDate,
          $lte: endOfMonth < endDate ? endOfMonth : endDate,
        },
      },
    },
    {
      $group: {
        _id: null,
        total: { $sum: "$amount" },
      },
    },
  ]);

  const todayData = await Expense.aggregate([
    {
      $match: {
        userId: new mongoose.Types.ObjectId(userId),
        date: {
          $gte: startOfToday > startDate ? startOfToday : startDate,
          $lte: endOfToday < endDate ? endOfToday : endDate,
        },
      },
    },
    {
      $group: {
        _id: null,
        total: { $sum: "$amount" },
      },
    },
  ]);

  return {
    yearExpense,
    totalCategories: result.length,
    categoryExpense: result,
    monthExpense: monthData[0]?.total || 0,
    todayExpense: todayData[0]?.total || 0,
  };
};

export const monthlyExpenseService = async ({ userId, financialYear }) => {
  const { startDate, endDate } = getFYDateRange(financialYear);

  const raw = await Expense.aggregate([
    {
      $match: {
        userId: new mongoose.Types.ObjectId(userId),
        date: {
          $gte: startDate,
          $lte: endDate,
        },
      },
    },
    {
      $group: {
        _id: { $month: "$date" },
        total: { $sum: "$amount" },
      },
    },
  ]);

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

  const result = fyMonths.map((m) => {
    const found = raw.find((item) => item._id === m);

    return {
      month: monthNames[m],
      total: found ? found.total : 0,
    };
  });

  return result;
};
