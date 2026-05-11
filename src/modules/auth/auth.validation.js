import { z } from "zod";

export const registerUserSchema = z.object({
  body: z.object({
    name: z.string().min(3, "Name must be at least 3 chars"),
    email: z.string().email("Invalid email"),
    password: z.string().min(6, "Password must be at least 6 chars"),
  }),
});

export const loginUserSchema = z.object({
  body: z.object({
    email: z.string().email("Invalid email"),
    password: z.string().min(6, "Password must be at least 6 chars"),
  }),
});
