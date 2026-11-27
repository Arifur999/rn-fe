import { z } from "zod";
import { isDateString } from "@/lib/dates";

// Form fields arrive as strings; these turn them into the API payload.
// Bangla digits typed on a phone keyboard ("১২০০") are accepted too.

const BN_DIGITS = "০১২৩৪৫৬৭৮৯";
export const normalizeDigits = (value: string) =>
  value.replace(/[০-৯]/g, (d) => String(BN_DIGITS.indexOf(d))).replace(/,/g, "").trim();

export const requiredText = (label: string, max = 120) =>
  z.string().trim().min(1, `${label} দিন`).max(max, `${label} বেশি লম্বা`);

/** "" -> null, so clearing a field clears it on the server too. */
export const optionalText = (max = 500) =>
  z
    .string()
    .trim()
    .max(max, "লেখা বেশি লম্বা")
    .transform((v) => (v === "" ? null : v));

export const requiredDate = (label = "তারিখ") => z.string().refine(isDateString, `সঠিক ${label} দিন`);

export const optionalDate = () =>
  z
    .string()
    .refine((v) => v === "" || isDateString(v), "সঠিক তারিখ দিন")
    .transform((v) => (v === "" ? null : v));

const parseAmount = (v: string) => Number(normalizeDigits(v));

export const requiredMoney = (label: string, { positive = false } = {}) =>
  z
    .string()
    .refine((v) => normalizeDigits(v) !== "", `${label} দিন`)
    .refine((v) => Number.isFinite(parseAmount(v)), `${label} সংখ্যায় দিন`)
    .refine((v) => parseAmount(v) >= 0, `${label} মাইনাস হতে পারে না`)
    .refine((v) => !positive || parseAmount(v) > 0, `${label} শূন্যের বেশি দিন`)
    .refine((v) => parseAmount(v) <= 100_000_000, `${label} অনেক বেশি`)
    .transform(parseAmount);

/** Empty means 0. */
export const optionalMoney = (label: string) =>
  z
    .string()
    .refine((v) => normalizeDigits(v) === "" || Number.isFinite(parseAmount(v)), `${label} সংখ্যায় দিন`)
    .refine((v) => normalizeDigits(v) === "" || parseAmount(v) >= 0, `${label} মাইনাস হতে পারে না`)
    .transform((v) => (normalizeDigits(v) === "" ? 0 : parseAmount(v)));

export const optionalTime = () =>
  z
    .string()
    .refine((v) => v === "" || /^([01]\d|2[0-3]):[0-5]\d$/.test(v), "সময় ঠিক নেই")
    .transform((v) => (v === "" ? null : v));

export const requiredId = (label: string) => z.string().min(1, `${label} বাছাই করুন`);

export const optionalId = () => z.string().transform((v) => (v === "" ? null : v));

/** { "fare": "ভাড়া দিন" } from a failed safeParse, for showing under fields. */
export const fieldErrorsOf = (error: z.ZodError): Record<string, string> => {
  const out: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = issue.path.join(".");
    if (!out[key]) out[key] = issue.message;
  }
  return out;
};
