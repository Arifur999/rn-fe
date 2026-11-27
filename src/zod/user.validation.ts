import { z } from "zod";
import { requiredText } from "./common";

const password = z.string().min(6, "পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে").max(200, "পাসওয়ার্ড বেশি লম্বা");

export const userFormZodSchema = z.object({
  name: requiredText("নাম", 80),
  email: z.string().trim().toLowerCase().pipe(z.email("সঠিক ইমেইল দিন")),
  password,
  role: z.enum(["owner", "super_admin"], "ভূমিকা বাছাই করুন"),
});

export const resetPasswordFormZodSchema = z.object({ password });

export type UserFormValues = z.input<typeof userFormZodSchema>;
