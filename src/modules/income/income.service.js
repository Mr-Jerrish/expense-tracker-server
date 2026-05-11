import { Income } from "../../models/income.models.js";
import { getFYDateRange, getFinancialYear } from "../../utils/financialYear.js";
import mongoose from "mongoose";

export const createIncomeService = async (data, userId) => {
  const {
    id,
    incomeSource,
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
    const income = await Income.findById(id);
    if (!income) throw new Error("Income not found");

    income.incomeSource = incomeSource;
    income.category = category;
    income.amount = amount;
    income.date = date;
    income.paymentMethod = paymentMethod;
    income.account = account;
    income.transactionId = transactionId;
    income.description = description;
    income.financialYear = financialYear;

    return await income.save();
  }

  return await new Income({
    userId,
    incomeSource,
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

export const getIncomeByIdService = async (id, userId) => {
  const income = await Income.findById(id);

  if (!income) throw new Error("Income not found");

  if (income.userId.toString() !== userId) {
    throw new Error("Unauthorized");
  }

  return income;
};

export const getAllIncomeService = async ({ userId, financialYear }) => {
  const query = { userId };

  if (financialYear) {
    const { startDate, endDate } = getFYDateRange(financialYear);

    query.date = {
      $gte: startDate,
      $lte: endDate,
    };
  }

  return await Income.find(query).sort({ date: -1 });
};

export const totalIncomeService = async ({ userId, financialYear }) => {
  const { startDate, endDate } = getFYDateRange(financialYear);

  const today = new Date();

  const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);

  const startOfToday = new Date(today.setHours(0, 0, 0, 0));
  const endOfToday = new Date(today.setHours(23, 59, 59, 999));

  const result = await Income.aggregate([
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

  const yearIncome = result.reduce((sum, item) => sum + item.total, 0);

  const monthData = await Income.aggregate([
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

  const todayData = await Income.aggregate([
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
    yearIncome,
    totalCategories: result.length,
    categoryIncome: result,

    monthIncome: monthData[0]?.total || 0,
    todayIncome: todayData[0]?.total || 0,
  };
};

export const monthlyIncomeService = async ({ userId, financialYear }) => {
  const { startDate, endDate } = getFYDateRange(financialYear);

  const raw = await Income.aggregate([
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

  // 🔥 Financial Year order (Apr → Mar)
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
      total: found ? found.total : 0, // 🔥 default 0
    };
  });

  return result;
};
