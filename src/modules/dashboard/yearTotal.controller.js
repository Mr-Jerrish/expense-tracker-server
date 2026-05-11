import {
  sendSuccessResponse,
  sendErrorResponse,
} from "../../utils/ApiResponse.js";
import {
  totalYearService,
  totalMonthService,
} from "../dashboard/yearTotal.service.js";

export const totalYear = async (req, res) => {
  try {
    const { userId, financialYear } = req.query;
    if (!userId || !financialYear) {
      return sendErrorResponse(res, {
        message: "userId and financialYear are required",
        statusCode: 400,
      });
    }
    const totalYear = await totalYearService({ userId, financialYear });
    return sendSuccessResponse(res, {
      key: "totalYear",
      data: totalYear,
      message: "Total Year fetched successfully",
      statusCode: 200,
    });
  } catch (error) {
    return sendErrorResponse(res, {
      key: "totalYear",
      data: {},
      message: error.message,
      statusCode: 400,
    });
  }
};

export const totalMonth = async (req, res) => {
  try {
    const { userId, financialYear } = req.query;
    if (!userId || !financialYear) {
      return sendErrorResponse(res, {
        message: "userId and financialYear are required",
        statusCode: 400,
      });
    }
    const totalMonths = await totalMonthService({ userId, financialYear });
    return sendSuccessResponse(res, {
      key: "totalMonths",
      data: totalMonths,
      message: "Total Year fetched successfully",
      statusCode: 200,
    });
  } catch (error) {
    return sendErrorResponse(res, {
      key: "totalMonths",
      data: {},
      message: error.message,
      statusCode: 400,
    });
  }
};
