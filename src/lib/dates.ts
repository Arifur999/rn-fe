// Calendar days in Bangladesh time, as "YYYY-MM-DD" strings (what the API takes).

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

export const isDateString = (value: unknown): value is string => {
  if (typeof value !== "string" || !DATE_RE.test(value)) return false;
  const parsed = new Date(`${value}T00:00:00.000Z`);
  return !Number.isNaN(parsed.getTime()) && parsed.toISOString().slice(0, 10) === value;
};

export const dhakaToday = (now: Date = new Date()): string =>
  new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Dhaka" }).format(now);

export const addDays = (day: string, days: number): string => {
  const date = new Date(`${day}T00:00:00.000Z`);
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().slice(0, 10);
};

export type PeriodKey = "today" | "yesterday" | "week" | "month" | "last_month" | "custom";

export interface Period {
  key: PeriodKey;
  from: string;
  to: string;
}

/** Saturday-start week, as most Bangladeshi businesses count it. */
const startOfWeek = (day: string): string => {
  const weekday = new Date(`${day}T00:00:00.000Z`).getUTCDay(); // 0 = Sunday ... 6 = Saturday
  return addDays(day, -((weekday + 1) % 7));
};

export const periodRange = (key: Exclude<PeriodKey, "custom">, today: string = dhakaToday()): Period => {
  switch (key) {
    case "today":
      return { key, from: today, to: today };
    case "yesterday": {
      const y = addDays(today, -1);
      return { key, from: y, to: y };
    }
    case "week":
      return { key, from: startOfWeek(today), to: today };
    case "month":
      return { key, from: `${today.slice(0, 7)}-01`, to: today };
    case "last_month": {
      const firstThisMonth = `${today.slice(0, 7)}-01`;
      const lastPrev = addDays(firstThisMonth, -1);
      return { key, from: `${lastPrev.slice(0, 7)}-01`, to: lastPrev };
    }
  }
};

/**
 * Reads ?period=&from=&to= from the URL. Unknown or missing values fall back
 * to `fallback`; a valid custom range wins.
 */
export const resolvePeriod = (
  params: { period?: string; from?: string; to?: string },
  fallback: Exclude<PeriodKey, "custom"> = "today",
  today: string = dhakaToday(),
): Period => {
  if (params.period === "custom" && isDateString(params.from)) {
    const to = isDateString(params.to) && params.to >= params.from ? params.to : params.from;
    return { key: "custom", from: params.from, to };
  }
  const known = ["today", "yesterday", "week", "month", "last_month"] as const;
  const key = known.find((k) => k === params.period) ?? fallback;
  return periodRange(key, today);
};
