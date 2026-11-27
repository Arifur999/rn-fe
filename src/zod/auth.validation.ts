import { z } from "zod";
import { requiredText } from "./common";

export const loginFormZodSchema = z.object({
  email: z.string().trim().toLowerCase().pipe(z.email("সঠিক ইমেইল দিন")),
  password: z.string().min(1, "পাসওয়ার্ড দিন"),
});

export const changePasswordFormZodSchema = z
  .object({
    current_password: z.string().min(1, "বর্তমান পাসওয়ার্ড দিন"),
    new_password: z.string().min(6, "নতুন পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে"),
    confirm_password: z.string(),
  })
  .refine((v) => v.new_password === v.confirm_password, {
    message: "দুইবার একই পাসওয়ার্ড দিন",
    path: ["confirm_password"],
  })
  .transform(({ current_password, new_password }) => ({ current_password, new_password }));

export const settingsFormZodSchema = z.object({
  business_name: requiredText("ব্যবসার নাম", 80),
});
