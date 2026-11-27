import { z } from "zod";
import { optionalDate, optionalText, requiredText } from "./common";

export const carFormZodSchema = z.object({
  name: requiredText("গাড়ির নাম/মডেল", 80),
  number: requiredText("গাড়ির নম্বর", 40),
  type: z.enum(["car", "micro", "hiace", "bus", "other"], "গাড়ির ধরন বাছাই করুন"),
  status: z.enum(["active", "maintenance", "inactive"], "অবস্থা বাছাই করুন"),
  fitness_expiry: optionalDate(),
  tax_token_expiry: optionalDate(),
  insurance_expiry: optionalDate(),
  route_permit_expiry: optionalDate(),
  note: optionalText(),
});

export type CarFormValues = z.input<typeof carFormZodSchema>;
export type CarPayload = z.output<typeof carFormZodSchema>;

export const emptyCarForm: CarFormValues = {
  name: "",
  number: "",
  type: "micro",
  status: "active",
  fitness_expiry: "",
  tax_token_expiry: "",
  insurance_expiry: "",
  route_permit_expiry: "",
  note: "",
};
