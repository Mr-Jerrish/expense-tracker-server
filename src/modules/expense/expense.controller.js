import {
  createExpenseService,
  getExpenseByIdService,
  getAllExpenseService,
  totalExpenseService,
  monthlyExpenseService,
} from "../expense/expense.service.js";
import {
  sendSuccessResponse,
  sendErrorResponse,
} from "../../utils/ApiResponse.js";
import mongoose from "mongoose";

export const createExpense = async (req, res) => {
  try {
    const { userId } = req.query;
    if (!userId) {
      return sendErrorResponse(res, {
        message: "userId is required",
        statusCode: 400,
      });
    }
    const expense = await createExpenseService(req.body, userId);

    return sendSuccessResponse(res, {
      key: "expense",
      data: expense,
      message: req.body.id
        ? "Expense updated successfully"
        : "Expense created successfully",
    });
  } catch (error) {
    return sendErrorResponse(res, {
      key: "expense",
      data: {},
      message: error.message,
      statusCode: 500,
    });
  }
};

export const getExpenseById = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.query;
    if (!id || !userId) {
      return sendErrorResponse(res, {
        message: "id or userId is required",
        statusCode: 400,
      });
    }
    const expense = await getExpenseByIdService(id, userId);
    return sendSuccessResponse(res, {
      key: "expense",
      data: expense,
      message: "Expense fetched successfully",
      statusCode: 200,
    });
  } catch (error) {
    return sendErrorResponse(res, {
      key: "expense",
      data: {},
      message: error.message,
      statusCode: 400,
    });
  }
};

export const getAllExpense = async (req, res) => {
  try {
    const { userId, financialYear } = req.query;
    if (!userId || !financialYear) {
      return sendErrorResponse(res, {
        message: "userId or financialYear is required",
        statusCode: 400,
      });
    }

    const expense = await getAllExpenseService({ userId, financialYear });
    return sendSuccessResponse(res, {
      key: "expense",
      data: expense,
      message: "Expense fetched successfully",
      statusCode: 200,
    });
  } catch (error) {
    return sendErrorResponse(res, {
      key: "expense",
      data: {},
      message: error.message,
      statusCode: 400,
    });
  }
};

export const expenseSummary = async (req, res) => {
  try {
    const { userId, financialYear } = req.query;

    if (!userId || !financialYear) {
      return sendErrorResponse(res, {
        message: "userId and financialYear are required",
        statusCode: 400,
      });
    }

    const expense = await totalExpenseService({
      userId,
      financialYear,
    });

    return sendSuccessResponse(res, {
      key: "expense",
      data: expense,
      message: "Expense fetched successfully",
      statusCode: 200,
    });
  } catch (error) {
    return sendErrorResponse(res, {
      key: "expense",
      data: {},
      message: error.message,
      statusCode: 400,
    });
  }
};

export const monthlyExpense = async (req, res) => {
  try {
    const { userId, financialYear } = req.query;

    if (!userId || !financialYear) {
      return sendErrorResponse(res, {
        message: "userId and financialYear are required",
        statusCode: 400,
      });
    }

    const expense = await monthlyExpenseService({
      userId,
      financialYear,
    });
    return sendSuccessResponse(res, {
      key: "expense",
      data: expense,
      message: "Expense fetched successfully",
      statusCode: 200,
    });
  } catch (error) {
    return sendErrorResponse(res, {
      key: "expense",
      data: {},
      message: error.message,
      statusCode: 400,
    });
  }
};
