import express from "express";
import cors from "cors";
import authRoute from "./modules/auth/auth.route.js";
import incomeRoute from "../src/modules/income/income.routes.js";
import expenseRoute from "../src/modules/expense/expense.routes.js";
import totalYearRoute from "../src/modules/dashboard/yearTotalRoutes.js";
import aiChat from "../src/modules/aiintegrate/ai.route.js";
const app = express();

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://expensepilot-ai.vercel.app",
      "https://expense-tracker-client-five-ashy.vercel.app",
      "https://expense-tracker-api-ml7u.onrender.com",
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  }),
);
app.use(express.json());
app.use("/api/auth", authRoute);
app.use("/api/income", incomeRoute);
app.use("/api/expense", expenseRoute);
app.use("/api/dashboard", totalYearRoute);
app.use("/api/ai", aiChat);

export default app;
