import {
  createIncomeService,
  getAllIncomeService,
  getIncomeByIdService,
  totalIncomeService,
  monthlyIncomeService,
} from "../income/income.service.js";
import {
  sendSuccessResponse,
  sendErrorResponse,
} from "../../utils/ApiResponse.js";
import mongoose from "mongoose";

export const createIncome = async (req, res) => {
  try {
    const { userId } = req.query;

    if (!userId) {
      return sendErrorResponse(res, {
        message: "userId is required",
        statusCode: 400,
      });
    }

    const income = await createIncomeService(req.body, userId);

    return sendSuccessResponse(res, {
      key: "income",
      data: income,
      message: req.body.id
        ? "Income updated successfully"
        : "Income created successfully",
      statusCode: req.body.id ? 200 : 201,
    });
  } catch (error) {
    return sendErrorResponse(res, {
      key: "income",
      data: {},
      message: error.message,
      statusCode: 400,
    });
  }
};

export const getIncomeById = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.query;

    if (!id) {
      return sendErrorResponse(res, {
        message: "Income ID is required",
        statusCode: 400,
      });
    }

    if (!userId) {
      return sendErrorResponse(res, {
        message: "userId is required",
        statusCode: 400,
      });
    }

    const income = await getIncomeByIdService(id, userId);

    return sendSuccessResponse(res, {
      key: "income",
      data: income,
      message: "Income fetched successfully",
      statusCode: 200,
    });
  } catch (error) {
    return sendErrorResponse(res, {
      key: "income",
      data: {},
      message: error.message,
      statusCode: 400,
    });
  }
};

export const getAllIncome = async (req, res) => {
  try {
    const { userId, financialYear } = req.query;

    if (!userId) {
      return sendErrorResponse(res, {
        message: "userId is required",
        statusCode: 400,
      });
    }

    const income = await getAllIncomeService({ userId, financialYear });

    return sendSuccessResponse(res, {
      key: "income",
      data: income,
      message: "Income fetched successfully",
      statusCode: 200,
    });
  } catch (error) {
    return sendErrorResponse(res, {
      message: error.message,
      statusCode: 400,
    });
  }
};

export const IncomeSummary = async (req, res) => {
  try {
    const { userId, financialYear } = req.query;

    if (!userId || !financialYear) {
      return sendErrorResponse(res, {
        message: "userId and financialYear are required",
        statusCode: 400,
      });
    }

    const income = await totalIncomeService({
      userId,
      financialYear,
    });

    return sendSuccessResponse(res, {
      key: "income",
      data: income,
      message: "Income fetched successfully",
      statusCode: 200,
    });
  } catch (error) {
    return sendErrorResponse(res, {
      key: "income",
      data: {},
      message: error.message,
      statusCode: 400,
    });
  }
};

export const monthlyIncome = async (req, res) => {
  try {
    const { userId, financialYear } = req.query;

    if (!userId || !financialYear) {
      return sendErrorResponse(res, {
        message: "userId and financialYear are required",
        statusCode: 400,
      });
    }

    const income = await monthlyIncomeService({
      userId,
      financialYear,
    });
    return sendSuccessResponse(res, {
      key: "income",
      data: income,
      message: "Income fetched successfully",
      statusCode: 200,
    });
  } catch (error) {
    return sendErrorResponse(res, {
      key: "income",
      data: {},
      message: error.message,
      statusCode: 400,
    });
  }
};
