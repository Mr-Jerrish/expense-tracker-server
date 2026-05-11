import { z } from "zod";

export const createExpenseSchema = z.object({
  body: z.object({
    id: z.string().optional(),
    expenseSource: z.string().min(3, "Expense source must be atleast 3 chars"),
    category: z.string(),
    amount: z.number(),
    date: z.coerce.date(),
    paymentMethod: z.string(),
    account: z.string(),
  }),
});
