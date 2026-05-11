import express from "express";
import {
  createIncome,
  getAllIncome,
  getIncomeById,
  IncomeSummary,
  monthlyIncome,
} from "../income/income.controller.js";
import { validate } from "../../middleware/validate.middleware.js";
import { createIncomeSchema } from "../income/income.validation.js";

const router = express.Router();

router.put("/createincome", validate(createIncomeSchema), createIncome);
router.get("/getallincome", getAllIncome);
router.get("/getById/:id", getIncomeById);
router.get("/summary", IncomeSummary);
router.get("/monthlyIncome", monthlyIncome);

export default router;
