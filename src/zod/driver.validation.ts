import { z } from "zod";
import { normalizeDigits, optionalDate, optionalId, optionalText, requiredText } from "./common";

export const driverFormZodSchema = z.object({
  name: requiredText("ড্রাইভারের নাম", 80),
  phone: requiredText("মোবাইল নম্বর", 20)
    .transform(normalizeDigits)
    .refine((v) => /^[0-9+\-\s]{6,20}$/.test(v), "সঠিক মোবাইল নম্বর দিন"),
  license_number: optionalText(40),
  address: optionalText(200),
  joined_at: optionalDate(),
  default_car_id: optionalId(),
  status: z.enum(["active", "inactive"], "অবস্থা বাছাই করুন"),
  note: optionalText(),
});

export type DriverFormValues = z.input<typeof driverFormZodSchema>;
export type DriverPayload = z.output<typeof driverFormZodSchema>;

export const emptyDriverForm: DriverFormValues = {
  name: "",
  phone: "",
  license_number: "",
  address: "",
  joined_at: "",
  default_car_id: "",
  status: "active",
  note: "",
};
