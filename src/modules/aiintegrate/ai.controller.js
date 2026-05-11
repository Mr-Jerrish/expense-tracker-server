import { askAIService } from "../aiintegrate/ai.service.js";

import {
  sendSuccessResponse,
  sendErrorResponse,
} from "../../utils/ApiResponse.js";

export const askAI = async (req, res) => {
  try {
    const { query, userId, financialYear } = req.body;

    // 🔥 Validation
    if (!query || !userId || !financialYear) {
      return sendErrorResponse(res, {
        message: "query, userId and financialYear are required",
        statusCode: 400,
      });
    }

    // 🔥 Service Call
    const response = await askAIService({
      query,
      userId,
      financialYear,
    });

    return sendSuccessResponse(res, {
      key: "ai",
      data: response,
      message: "AI response fetched successfully",
      statusCode: 200,
    });
  } catch (error) {
    console.log(error);

    return sendErrorResponse(res, {
      key: "ai",
      data: {},
      message: error.message,
      statusCode: 500,
    });
  }
};
