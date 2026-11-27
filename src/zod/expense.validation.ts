import { z } from "zod";
import { optionalId, optionalText, requiredDate, requiredMoney } from "./common";

export const expenseFormZodSchema = z.object({
  expense_date: requiredDate("খরচের তারিখ"),
  category: z.enum(["fuel", "toll", "parking", "repair", "driver_payment", "food", "other"], "খরচের ধরন বাছাই করুন"),
  amount: requiredMoney("খরচ", { positive: true }),
  car_id: optionalId(),
  driver_id: optionalId(),
  note: optionalText(),
});

export type ExpenseFormValues = z.input<typeof expenseFormZodSchema>;
export type ExpensePayload = z.output<typeof expenseFormZodSchema>;

export const emptyExpenseForm = (today: string): ExpenseFormValues => ({
  expense_date: today,
  category: "fuel",
  amount: "",
  car_id: "",
  driver_id: "",
  note: "",
});
