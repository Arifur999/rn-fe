import type { CarStatus, CarType, DriverStatus, ExpenseCategory, TripStatus } from "@/types";

// Every Bangla label for an API enum lives here, so a screen never shows "fuel".

export const CAR_TYPE_LABEL: Record<CarType, string> = {
  car: "প্রাইভেট কার",
  micro: "মাইক্রোবাস",
  hiace: "হায়েস",
  bus: "বাস",
  other: "অন্যান্য",
};

export const CAR_STATUS_LABEL: Record<CarStatus, string> = {
  active: "চালু",
  maintenance: "মেরামতে",
  inactive: "বন্ধ",
};

/** Badge colour per status (see components/ui/Card Badge tones). */
export const CAR_STATUS_TONE = { active: "green", maintenance: "amber", inactive: "gray" } as const satisfies Record<CarStatus, string>;
export const DRIVER_STATUS_TONE = { active: "green", inactive: "gray" } as const satisfies Record<DriverStatus, string>;
export const TRIP_STATUS_TONE = { running: "blue", completed: "green", cancelled: "gray" } as const satisfies Record<TripStatus, string>;

export const DRIVER_STATUS_LABEL: Record<DriverStatus, string> = {
  active: "কাজে আছে",
  inactive: "বন্ধ",
};

export const TRIP_STATUS_LABEL: Record<TripStatus, string> = {
  running: "চলমান",
  completed: "শেষ",
  cancelled: "বাতিল",
};

export const EXPENSE_CATEGORY_LABEL: Record<ExpenseCategory, string> = {
  fuel: "তেল/গ্যাস",
  toll: "টোল",
  parking: "পার্কিং",
  repair: "মেরামত",
  driver_payment: "ড্রাইভার পেমেন্ট",
  food: "খাবার",
  other: "অন্যান্য",
};

export const EXPENSE_CATEGORY_EMOJI: Record<ExpenseCategory, string> = {
  fuel: "⛽",
  toll: "🛣️",
  parking: "🅿️",
  repair: "🔧",
  driver_payment: "👤",
  food: "🍽️",
  other: "📦",
};

export const PERIOD_LABEL = {
  today: "আজ",
  yesterday: "গতকাল",
  week: "এই সপ্তাহ",
  month: "এই মাস",
  last_month: "গত মাস",
  custom: "তারিখ বাছাই",
} as const;

export const APP_NAME = "রেন্ট এ কার";

export const CREDIT = {
  name: "Arif",
  url: "https://www.instagram.com/arif_xtwo",
};
