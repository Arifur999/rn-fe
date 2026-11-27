import { z } from "zod";
import {
  normalizeDigits,
  optionalMoney,
  optionalText,
  optionalTime,
  requiredDate,
  requiredId,
  requiredMoney,
  requiredText,
} from "./common";

const EXPENSE_CATEGORIES = ["fuel", "toll", "parking", "repair", "driver_payment", "food", "other"] as const;

const tripExpenseZodSchema = z.object({
  category: z.enum(EXPENSE_CATEGORIES, "খরচের ধরন বাছাই করুন"),
  amount: requiredMoney("খরচ", { positive: true }),
  note: optionalText(200),
});

export const tripFormZodSchema = z
  .object({
    trip_date: requiredDate("ট্রিপের তারিখ"),
    car_id: requiredId("গাড়ি"),
    driver_id: requiredId("ড্রাইভার"),
    from_place: requiredText("কোথা থেকে", 120),
    to_place: requiredText("কোথায়", 120),
    customer_name: optionalText(80),
    customer_phone: optionalText(20).transform((v) => (v ? normalizeDigits(v) : v)),
    out_time: optionalTime(),
    return_time: optionalTime(),
    fare: requiredMoney("ভাড়া"),
    paid: optionalMoney("পেয়েছি টাকা"),
    status: z.enum(["running", "completed", "cancelled"], "অবস্থা বাছাই করুন"),
    note: optionalText(),
    expenses: z.array(tripExpenseZodSchema).max(20),
  })
  .refine((v) => v.paid <= v.fare, { message: "পেয়েছি টাকা ভাড়ার চেয়ে বেশি হতে পারে না", path: ["paid"] });

export type TripFormValues = z.input<typeof tripFormZodSchema>;
export type TripPayload = z.output<typeof tripFormZodSchema>;
export type TripExpenseFormValues = z.input<typeof tripExpenseZodSchema>;

export const emptyTripForm = (today: string, defaults: Partial<TripFormValues> = {}): TripFormValues => ({
  trip_date: today,
  car_id: "",
  driver_id: "",
  from_place: "",
  to_place: "",
  customer_name: "",
  customer_phone: "",
  out_time: "",
  return_time: "",
  fare: "",
  paid: "",
  status: "completed",
  note: "",
  expenses: [],
  ...defaults,
});

export const collectFormZodSchema = z.object({
  amount: requiredMoney("টাকার পরিমাণ", { positive: true }),
});
