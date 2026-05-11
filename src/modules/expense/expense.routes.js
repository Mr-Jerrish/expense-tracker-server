import express from "express";
import {
  createExpense,
  getExpenseById,
  getAllExpense,
  expenseSummary,
  monthlyExpense,
} from "../expense/expense.controller.js";
import { validate } from "../../middleware/validate.middleware.js";
import { createExpenseSchema } from "../expense/expense.validation.js";

const router = express.Router();

router.put("/createexpense", validate(createExpenseSchema), createExpense);
router.get("/getallexpense", getAllExpense);
router.get("/getById/:id", getExpenseById);
router.get("/summary", expenseSummary);
router.get("/monthlyexpense", monthlyExpense);

export default router;
