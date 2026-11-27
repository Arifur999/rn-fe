import { ArrowLeft, CalendarClock, ChevronRight, Route } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { PeriodFilter } from "@/components/shared/PeriodFilter";
import { RecentTrips } from "@/components/shared/RecentTrips";
import { TotalsGrid } from "@/components/shared/TotalsGrid";
import { Badge, NumberPlate, Section } from "@/components/ui/Card";
import { CAR_STATUS_LABEL, CAR_STATUS_TONE, CAR_TYPE_LABEL } from "@/constants/bn";
import { dhakaToday, resolvePeriod } from "@/lib/dates";
import { PAPER_FIELDS } from "@/lib/expiry";
import { formatDate, formatDaysLeft, formatRange } from "@/lib/format";
import { loadPage } from "@/lib/loadPage";
import { param, type SearchParams } from "@/lib/pageParams";
import { cn } from "@/lib/utils";
import { getCarSummary } from "@/services/car.services";

export const metadata: Metadata = { title: "গাড়ির হিসাব" };

export default async function CarDetailPage({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<SearchParams> }) {
  const { id } = await params;
  const sp = await searchParams;
  const period = resolvePeriod({ period: param(sp, "period"), from: param(sp, "from"), to: param(sp, "to") }, "month");
  const { data } = await loadPage(() => getCarSummary(id, period));
  const { car, totals, recent_trips } = data;
  const today = dhakaToday();
  const daysTo = (date: string) => Math.round((Date.parse(`${date}T00:00:00Z`) - Date.parse(`${today}T00:00:00Z`)) / 86_400_000);

  return (
    <div className="flex flex-col gap-5">
      <Link href="/cars" className="inline-flex w-fit items-center gap-1.5 text-sm font-semibold text-ink-2 hover:text-primary">
        <ArrowLeft className="size-4" /> সব গাড়ি
      </Link>
      <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
        <h1 className="text-2xl font-bold sm:text-[28px]">{car.name}</h1>
        <NumberPlate number={car.number} />
        <Badge tone={CAR_STATUS_TONE[car.status]}>{CAR_STATUS_LABEL[car.status]}</Badge>
        <span className="text-sm text-ink-2">{CAR_TYPE_LABEL[car.type]}</span>
      </div>

      <PeriodFilter period={period} />
      <p className="-mt-2 text-sm text-ink-2">{formatRange(period.from, period.to)}</p>
      <TotalsGrid totals={totals} />

      <div className="grid gap-4 lg:grid-cols-3">
        <Section
          title="ট্রিপগুলো"
          icon={<Route className="size-5 text-primary" />}
          className="lg:col-span-2"
          action={
            <Link
              href={`/trips?car=${car.id}&period=${period.key}${period.key === "custom" ? `&from=${period.from}&to=${period.to}` : ""}`}
              className="inline-flex items-center gap-0.5 text-sm font-semibold text-primary"
            >
              সব দেখুন <ChevronRight className="size-4" />
            </Link>
          }
        >
          <RecentTrips trips={recent_trips} show="car" />
        </Section>

        <Section title="কাগজপত্রের মেয়াদ" icon={<CalendarClock className="size-5 text-due" />}>
          <ul className="flex flex-col gap-2.5">
            {PAPER_FIELDS.map(({ key, label }) => {
              const date = car[key];
              const days = date ? daysTo(date) : null;
              return (
                <li key={key} className="flex items-center justify-between gap-2 rounded-xl bg-surface-2 px-3 py-2.5">
                  <span className="font-medium">{label}</span>
                  {date && days !== null ? (
                    <span className={cn("text-right text-sm", days <= 30 ? "font-semibold text-due" : "text-ink-2")}>
                      {formatDate(date)}
                      {days <= 30 ? <span className="block text-xs">{formatDaysLeft(days)}</span> : null}
                    </span>
                  ) : (
                    <span className="text-sm text-ink-3">দেওয়া নেই</span>
                  )}
                </li>
              );
            })}
          </ul>
          {car.note ? <p className="mt-3 rounded-xl bg-primary-soft px-3 py-2 text-sm text-ink-2">{car.note}</p> : null}
        </Section>
      </div>
    </div>
  );
}
