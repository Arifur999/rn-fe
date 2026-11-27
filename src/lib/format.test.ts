import { describe, expect, it } from "vitest";
import { addDays, periodRange, resolvePeriod } from "./dates";
import { formatDaysLeft, formatMoney, formatTime, toBnNumber } from "./format";

describe("format", () => {
  it("writes money and digits in Bangla", () => {
    expect(formatMoney(12500)).toBe("৳ ১২,৫০০");
    expect(toBnNumber("01711")).toBe("০১৭১১");
  });

  it("words time of day", () => {
    expect(formatTime("07:30")).toBe("সকাল ৭:৩০");
    expect(formatTime("14:05")).toBe("দুপুর ২:০৫");
    expect(formatTime(null)).toBe("");
  });

  it("words days left", () => {
    expect(formatDaysLeft(-3)).toBe("৩ দিন আগে শেষ");
    expect(formatDaysLeft(0)).toBe("আজ শেষ");
    expect(formatDaysLeft(12)).toBe("১২ দিন বাকি");
  });
});

describe("periods", () => {
  // 2026-11-25 is a Wednesday
  const today = "2026-11-25";

  it("builds preset ranges", () => {
    expect(periodRange("today", today)).toMatchObject({ from: today, to: today });
    expect(periodRange("week", today)).toMatchObject({ from: "2026-11-21", to: today }); // Saturday
    expect(periodRange("month", today)).toMatchObject({ from: "2026-11-01", to: today });
    expect(periodRange("last_month", "2026-01-10")).toMatchObject({ from: "2025-12-01", to: "2025-12-31" });
  });

  it("resolves URL params safely", () => {
    expect(resolvePeriod({}, "today", today).key).toBe("today");
    expect(resolvePeriod({ period: "nonsense" }, "month", today).key).toBe("month");
    expect(resolvePeriod({ period: "custom", from: "2026-11-01", to: "2026-11-10" }, "today", today)).toMatchObject({
      from: "2026-11-01",
      to: "2026-11-10",
    });
    // to before from collapses to a single day
    expect(resolvePeriod({ period: "custom", from: "2026-11-10", to: "2026-11-01" }, "today", today).to).toBe("2026-11-10");
    // bad custom falls back
    expect(resolvePeriod({ period: "custom", from: "bad" }, "today", today).key).toBe("today");
  });

  it("adds days across months", () => {
    expect(addDays("2026-11-30", 1)).toBe("2026-12-01");
  });
});
