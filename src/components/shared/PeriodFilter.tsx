"use client";

import { CalendarDays, LoaderCircle } from "lucide-react";
import { PERIOD_LABEL } from "@/constants/bn";
import { useUrlParams } from "@/hooks/useUrlParams";
import type { Period, PeriodKey } from "@/lib/dates";
import { cn } from "@/lib/utils";

const PRESETS: Exclude<PeriodKey, "custom">[] = ["today", "yesterday", "week", "month", "last_month"];

/** আজ / গতকাল / এই সপ্তাহ / এই মাস / গত মাস / তারিখ বাছাই, kept in the URL. */
export function PeriodFilter({ period }: { period: Period }) {
  const { setParams, isPending } = useUrlParams();

  const chip = (active: boolean) =>
    cn(
      "h-9 shrink-0 cursor-pointer rounded-full border px-3.5 text-sm font-medium transition-colors",
      active ? "border-primary bg-primary text-white shadow-sm" : "border-line bg-surface text-ink-2 hover:border-primary/40",
    );

  return (
    <div className="flex min-w-0 flex-col gap-2">
      <div className="-mx-4 flex items-center gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:px-0">
        {PRESETS.map((key) => (
          <button key={key} type="button" className={chip(period.key === key)} onClick={() => setParams({ period: key, from: null, to: null })}>
            {PERIOD_LABEL[key]}
          </button>
        ))}
        <button
          type="button"
          className={cn(chip(period.key === "custom"), "inline-flex items-center gap-1.5")}
          onClick={() => setParams({ period: "custom", from: period.from, to: period.to })}
        >
          <CalendarDays className="size-4" />
          {PERIOD_LABEL.custom}
        </button>
        {isPending ? <LoaderCircle className="size-4 shrink-0 animate-spin text-primary" aria-label="লোড হচ্ছে" /> : null}
      </div>
      {period.key === "custom" ? (
        <div className="flex flex-wrap items-center gap-2">
          <input
            type="date"
            aria-label="শুরুর তারিখ"
            value={period.from}
            max={period.to}
            onChange={(e) => e.target.value && setParams({ period: "custom", from: e.target.value })}
            className="h-10 rounded-xl border border-line bg-surface px-3 text-sm"
          />
          <span className="text-ink-3">থেকে</span>
          <input
            type="date"
            aria-label="শেষের তারিখ"
            value={period.to}
            min={period.from}
            onChange={(e) => e.target.value && setParams({ period: "custom", to: e.target.value })}
            className="h-10 rounded-xl border border-line bg-surface px-3 text-sm"
          />
        </div>
      ) : null}
    </div>
  );
}
