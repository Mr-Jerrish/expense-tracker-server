// import OpenAI from "openai";

// const openai = new OpenAI({
//   apiKey: process.env.OPENROUTER_API_KEY,
//   baseURL: "https://openrouter.ai/api/v1",
// });

// const getMonthFromText = (text) => {
//   const months = {
//     january: 0,
//     february: 1,
//     march: 2,
//     april: 3,
//     may: 4,
//     june: 5,
//     july: 6,
//     august: 7,
//     september: 8,
//     october: 9,
//     november: 10,
//     december: 11,
//   };

//   const lower = text.toLowerCase();

//   for (let key in months) {
//     if (lower.includes(key)) {
//       return months[key];
//     }
//   }

//   return null;
// };

// export const parseQueryWithAI = async (query) => {
//   const res = await openai.chat.completions.create({
//     model: "openrouter/free",
//     messages: [
//       {
//         role: "system",
//         content: `
// Convert user query into JSON.

// Fields:
// - action: list | total | compare
// - type: income | expense | both
// - field: source | amount
// - month: number (0-11)

// Return ONLY JSON.
//         `,
//       },
//       { role: "user", content: query },
//     ],
//   });

//   let content = res.choices[0].message.content?.trim();

//   if (!content) return {};

//   // 🔥 clean unwanted text
//   const jsonStart = content.indexOf("{");
//   if (jsonStart !== -1) {
//     content = content.slice(jsonStart);
//   }

//   let parsed = {};

//   try {
//     parsed = JSON.parse(content);
//   } catch {
//     parsed = {};
//   }

//   // 🔥 FINAL FIX: manual month override
//   const manualMonth = getMonthFromText(query);

//   if (manualMonth !== null) {
//     parsed.month = manualMonth;
//   }

//   return parsed;
// };

import OpenAI from "openai";
import mongoose from "mongoose";

import { Income } from "../../models/income.models.js";
import { Expense } from "../../models/expense.model.js";

const openai = new OpenAI({
  apiKey: process.env.OPENROUTER_API_KEY,
  baseURL: "https://openrouter.ai/api/v1",
});

// export const askAIService = async ({ query, userId, financialYear }) => {
//   // 🔥 AI Understanding
//   const completion = await openai.chat.completions.create({
//     model: "openrouter/free",
//     messages: [
//       {
//         role: "system",
//         content: `
// You are an Expense Tracker AI.

// Return ONLY JSON.

// Examples:

// User:
// show my yearly income

// Response:
// {
//   "type":"income",
//   "summaryType":"yearly"
// }

// User:
// show my yearly expense

// Response:
// {
//   "type":"expense",
//   "summaryType":"yearly"
// }
// `,
//       },
//       {
//         role: "user",
//         content: query,
//       },
//     ],
//   });

//   // 🔥 AI Text
//   const aiText = completion.choices[0].message.content;

//   const cleaned = aiText
//     .replace(/```json/g, "")
//     .replace(/```/g, "")
//     .trim();

//   const aiData = JSON.parse(cleaned);

//   const { type, summaryType } = aiData;

//   // 🔥 Select Model
//   const Model = type === "income" ? Income : Expense;

//   // 🔥 Aggregate
//   const result = await Model.aggregate([
//     {
//       $match: {
//         userId: new mongoose.Types.ObjectId(userId),
//         financialYear,
//       },
//     },

//     {
//       $group: {
//         _id: null,

//         totalAmount: {
//           $sum: "$amount",
//         },
//       },
//     },
//   ]);

//   const totalAmount = result[0]?.totalAmount || 0;

//   // 🔥 Final Response
//   if (type === "income" && summaryType === "yearly") {
//     return {
//       yearlyIncome: totalAmount,
//     };
//   }

//   if (type === "expense" && summaryType === "yearly") {
//     return {
//       yearlyExpense: totalAmount,
//     };
//   }

//   return {
//     totalAmount,
//   };
// };

export const askAIService = async ({ query, userId, financialYear }) => {
  // 🔥 AI Understanding
  const completion = await openai.chat.completions.create({
    model: "openrouter/free",
    messages: [
      {
        role: "system",
        content: `
You are an Expense Tracker AI.

Return ONLY JSON.

Examples:

User:
show my yearly income

Response:
{
  "type":"income",
  "summaryType":"yearly"
}

User:
show my yearly expense

Response:
{
  "type":"expense",
  "summaryType":"yearly"
}

User:
show my march income

Response:
{
  "type":"income",
  "summaryType":"monthly",
  "month":"march"
}

User:
show my april expense

Response:
{
  "type":"expense",
  "summaryType":"monthly",
  "month":"april"
}
`,
      },
      {
        role: "user",
        content: query,
      },
    ],
  });

  // 🔥 AI Text
  const aiText = completion.choices[0].message.content;

  const cleaned = aiText
    .replace(/```json/g, "")
    .replace(/```/g, "")
    .trim();

  const aiData = JSON.parse(cleaned);

  const { type, summaryType, month } = aiData;

  // 🔥 Month Map
  const monthMap = {
    january: 1,
    february: 2,
    march: 3,
    april: 4,
    may: 5,
    june: 6,
    july: 7,
    august: 8,
    september: 9,
    october: 10,
    november: 11,
    december: 12,
  };

  const monthNumber = monthMap[month?.toLowerCase()];

  // 🔥 Select Model
  const Model = type === "income" ? Income : Expense;

  // 🔥 Aggregate
  const result = await Model.aggregate([
    {
      $match: {
        userId: new mongoose.Types.ObjectId(userId),

        financialYear,

        ...(summaryType === "monthly" && {
          $expr: {
            $eq: [{ $month: "$date" }, monthNumber],
          },
        }),
      },
    },

    {
      $group: {
        _id: null,

        totalAmount: {
          $sum: "$amount",
        },
      },
    },
  ]);

  const totalAmount = result[0]?.totalAmount || 0;

  // 🔥 Yearly Response
  if (type === "income" && summaryType === "yearly") {
    return {
      yearlyIncome: totalAmount,
    };
  }

  if (type === "expense" && summaryType === "yearly") {
    return {
      yearlyExpense: totalAmount,
    };
  }

  // 🔥 Monthly Response
  if (type === "income" && summaryType === "monthly") {
    return {
      month,
      monthlyIncome: totalAmount,
    };
  }

  if (type === "expense" && summaryType === "monthly") {
    return {
      month,
      monthlyExpense: totalAmount,
    };
  }

  return {
    totalAmount,
  };
};
