// Everything on screen is Bangla: digits, money and dates.

const numberFmt = new Intl.NumberFormat("bn-BD", { maximumFractionDigits: 2 });

export const toBnNumber = (value: number | string): string =>
  typeof value === "number" ? numberFmt.format(value) : value.replace(/\d/g, (d) => "০১২৩৪৫৬৭৮৯"[Number(d)]);

/** ৳ ১২,৫০০ */
export const formatMoney = (value: number): string => `৳ ${numberFmt.format(Math.round(value * 100) / 100)}`;

const dateFmt = new Intl.DateTimeFormat("bn-BD", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });
const shortDateFmt = new Intl.DateTimeFormat("bn-BD", { day: "numeric", month: "short", timeZone: "UTC" });

/** "2026-11-25" -> "২৫ নভেম্বর, ২০২৬" */
export const formatDate = (day: string): string => dateFmt.format(new Date(`${day}T00:00:00.000Z`));

/** "2026-11-25" -> "২৫ নভে." */
export const formatShortDate = (day: string): string => shortDateFmt.format(new Date(`${day}T00:00:00.000Z`));

/** "14:30" -> "দুপুর ২:৩০" style 12-hour time with a Bangla day-part. */
export const formatTime = (time: string | null | undefined): string => {
  if (!time) return "";
  const [h, m] = time.split(":").map(Number);
  const part = h < 4 ? "রাত" : h < 12 ? "সকাল" : h < 15 ? "দুপুর" : h < 18 ? "বিকাল" : h < 20 ? "সন্ধ্যা" : "রাত";
  const hour12 = h % 12 === 0 ? 12 : h % 12;
  return `${part} ${toBnNumber(hour12)}:${toBnNumber(String(m).padStart(2, "0"))}`;
};

export const formatRange = (from: string, to: string): string =>
  from === to ? formatDate(from) : `${formatDate(from)} – ${formatDate(to)}`;

/** Days until an expiry, worded for the alert list. */
export const formatDaysLeft = (days: number): string => {
  if (days < 0) return `${toBnNumber(-days)} দিন আগে শেষ`;
  if (days === 0) return "আজ শেষ";
  return `${toBnNumber(days)} দিন বাকি`;
};
