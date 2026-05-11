import { z } from "zod";

export const createIncomeSchema = z.object({
  body: z.object({
    id: z.string().optional(),
    incomeSource: z.string().min(3, "Income source must be at least 3 chars"),
    category: z.string(),
    amount: z.number(),
    date: z.coerce.date(),
    paymentMethod: z.string(),
    account: z.string(),
    // transactionId: z
    //   .string()
    //   .min(3, "Transaction id must be at least 3 chars")
    //   .max(20, "Transaction id must be at most 20 chars"),
    // description: z.string(),
  }),
});
