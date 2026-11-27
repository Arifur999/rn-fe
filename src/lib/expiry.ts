import type { ICar } from "@/types";

export const PAPER_FIELDS = [
  { key: "fitness_expiry", label: "ফিটনেস" },
  { key: "tax_token_expiry", label: "ট্যাক্স টোকেন" },
  { key: "insurance_expiry", label: "ইন্স্যুরেন্স" },
  { key: "route_permit_expiry", label: "রুট পারমিট" },
] as const;

const daysBetween = (from: string, to: string) =>
  Math.round((Date.parse(`${to}T00:00:00Z`) - Date.parse(`${from}T00:00:00Z`)) / 86_400_000);

/** A car's papers that expire within 30 days (or already have). */
export const carPaperWarnings = (car: ICar, today: string) =>
  PAPER_FIELDS.flatMap(({ key, label }) => {
    const date = car[key];
    if (!date) return [];
    const days = daysBetween(today, date);
    return days <= 30 ? [{ label, date, days }] : [];
  }).sort((a, b) => a.days - b.days);
