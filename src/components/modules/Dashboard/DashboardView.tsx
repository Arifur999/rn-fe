import { ArrowRight, BarChart3, CarFront, ChevronRight, FileWarning, HandCoins, PieChart, Users } from "lucide-react";
import Link from "next/link";
import { PeriodFilter } from "@/components/shared/PeriodFilter";
import { TotalsGrid } from "@/components/shared/TotalsGrid";
import { Badge, EmptyState, NumberPlate, Section } from "@/components/ui/Card";
import { CAR_STATUS_LABEL, EXPENSE_CATEGORY_EMOJI, EXPENSE_CATEGORY_LABEL, PERIOD_LABEL } from "@/constants/bn";
import type { Period } from "@/lib/dates";
import { formatDaysLeft, formatMoney, formatRange, formatShortDate, toBnNumber } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { IDashboard } from "@/types";
import { IncomeExpenseChart } from "./IncomeExpenseChart";

const periodWord = (period: Period) => (period.key === "custom" ? "এই সময়ে" : PERIOD_LABEL[period.key]);

export function DashboardView({ data, period }: { data: IDashboard; period: Period }) {
  const maxCarTrips = Math.max(1, ...data.per_car.map((c) => c.trips));
  const maxDriverTrips = Math.max(1, ...data.per_driver.map((d) => d.trips));
  const totalExpense = data.expense_by_category.reduce((s, e) => s + e.amount, 0);

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h1 className="text-2xl leading-tight font-bold sm:text-[28px]">ড্যাশবোর্ড</h1>
        <p className="mt-0.5 text-sm text-ink-2">{formatRange(period.from, period.to)}</p>
      </div>
      <PeriodFilter period={period} />

      {data.expiry_alerts.length > 0 ? (
        <div className="rounded-2xl border border-due/30 bg-due-soft p-4">
          <p className="mb-2 flex items-center gap-2 font-bold text-due">
            <FileWarning className="size-5" /> কাগজপত্রের মেয়াদ শেষ হচ্ছে
          </p>
          <ul className="flex flex-col gap-1.5">
            {data.expiry_alerts.map((a) => (
              <li key={`${a.car_id}-${a.document}`} className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm">
                <Link href={`/cars/${a.car_id}`} className="font-semibold hover:underline">
                  {a.car_name}
                </Link>
                <NumberPlate number={a.car_number} className="text-[11px]" />
                <span>
                  {a.document} — <b className={a.days_left < 0 ? "text-expense" : "text-due"}>{formatDaysLeft(a.days_left)}</b>
                </span>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      <TotalsGrid totals={data.totals} />

      <div className="grid gap-4 lg:grid-cols-2">
        <Section
          title={`${periodWord(period)} কোন গাড়ি কয়বার বের হয়েছে`}
          icon={<CarFront className="size-5 text-primary" />}
          action={
            data.idle_cars > 0 ? <Badge tone="gray">{toBnNumber(data.idle_cars)}টি বসে আছে</Badge> : <Badge tone="green">সব গাড়ি চলেছে</Badge>
          }
        >
          {data.per_car.length === 0 ? (
            <EmptyState icon={<CarFront className="size-7" />} title="কোনো চালু গাড়ি নেই" action={<Link href="/cars" className="font-semibold text-primary">গাড়ি যোগ করুন →</Link>} />
          ) : (
            <ul className="flex flex-col gap-3">
              {data.per_car.map((car) => (
                <li key={car.id}>
                  <Link href={`/cars/${car.id}`} className="group flex items-center gap-3">
                    <div className="min-w-0 flex-1">
                      <div className="mb-1 flex items-center justify-between gap-2">
                        <p className="flex min-w-0 items-center gap-2">
                          <span className="truncate font-semibold group-hover:text-primary">{car.name}</span>
                          <span className="truncate text-xs text-ink-3">{car.number}</span>
                          {car.status === "maintenance" ? <Badge tone="amber">{CAR_STATUS_LABEL.maintenance}</Badge> : null}
                        </p>
                        <span className={cn("shrink-0 text-sm font-bold", car.trips === 0 ? "text-ink-3" : "text-ink")}>
                          {car.trips === 0 ? "বের হয়নি" : `${toBnNumber(car.trips)} বার`}
                        </span>
                      </div>
                      <div className="h-2.5 overflow-hidden rounded-full bg-line-2">
                        <div className="h-full rounded-full bg-gradient-to-r from-primary to-blue-500" style={{ width: `${(car.trips / maxCarTrips) * 100}%` }} />
                      </div>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </Section>

        <Section title={`${periodWord(period)} ড্রাইভারের ট্রিপ`} icon={<Users className="size-5 text-accent-hover" />}>
          {data.per_driver.length === 0 ? (
            <EmptyState icon={<Users className="size-7" />} title="কোনো ড্রাইভার নেই" action={<Link href="/drivers" className="font-semibold text-primary">ড্রাইভার যোগ করুন →</Link>} />
          ) : (
            <ul className="flex flex-col gap-3">
              {data.per_driver.map((d, i) => (
                <li key={d.id}>
                  <Link href={`/drivers/${d.id}`} className="group flex items-center gap-3">
                    <span
                      className={cn(
                        "grid size-9 shrink-0 place-items-center rounded-full text-sm font-bold",
                        i === 0 && d.trips > 0 ? "bg-accent text-ink" : "bg-accent-soft text-accent-hover",
                      )}
                    >
                      {i === 0 && d.trips > 0 ? "🏆" : d.name.slice(0, 1)}
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="mb-1 flex items-center justify-between gap-2">
                        <span className="truncate font-semibold group-hover:text-primary">{d.name}</span>
                        <span className="shrink-0 text-sm">
                          <b>{toBnNumber(d.trips)}</b> ট্রিপ · <span className="text-income">{formatMoney(d.income)}</span>
                        </span>
                      </div>
                      <div className="h-2 overflow-hidden rounded-full bg-line-2">
                        <div className="h-full rounded-full bg-accent" style={{ width: `${(d.trips / maxDriverTrips) * 100}%` }} />
                      </div>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </Section>
      </div>

      <Section title="শেষ ৩০ দিনের আয় বনাম খরচ" icon={<BarChart3 className="size-5 text-income" />}>
        <IncomeExpenseChart chart={data.chart} />
      </Section>

      <div className="grid gap-4 lg:grid-cols-5">
        <Section
          className="lg:col-span-3"
          title="বাকি তালিকা"
          icon={<HandCoins className="size-5 text-due" />}
          action={
            data.due.count > 0 ? (
              <Link href="/trips?due=1&period=custom&from=2000-01-01" className="inline-flex items-center gap-0.5 text-sm font-semibold text-primary">
                সব দেখুন <ChevronRight className="size-4" />
              </Link>
            ) : null
          }
        >
          {data.due.count === 0 ? (
            <EmptyState icon={<HandCoins className="size-7" />} title="কোনো বাকি নেই 🎉" text="সব কাস্টমার পুরো টাকা দিয়েছেন।" />
          ) : (
            <>
              <div className="mb-3 flex items-baseline justify-between rounded-xl bg-due-soft px-3.5 py-2.5">
                <span className="text-sm font-medium text-due">মোট পাওনা ({toBnNumber(data.due.count)}টি ট্রিপ)</span>
                <span className="text-xl font-bold text-due">{formatMoney(data.due.total)}</span>
              </div>
              <ul className="-my-2 divide-y divide-line-2">
                {data.due.trips.map((t) => (
                  <li key={t.id} className="flex items-center gap-3 py-2.5">
                    <span className="w-12 shrink-0 text-center text-xs font-semibold text-ink-2">{formatShortDate(t.trip_date)}</span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-semibold">{t.customer_name || "নাম নেই"}</p>
                      <p className="flex items-center gap-1 truncate text-xs text-ink-2">
                        {t.from_place} <ArrowRight className="size-3" /> {t.to_place} · {t.car.name}
                      </p>
                    </div>
                    <span className="shrink-0 font-bold text-due">{formatMoney(t.due)}</span>
                  </li>
                ))}
              </ul>
            </>
          )}
        </Section>

        <Section className="lg:col-span-2" title={`${periodWord(period)} খরচের খাত`} icon={<PieChart className="size-5 text-expense" />}>
          {data.expense_by_category.length === 0 ? (
            <EmptyState icon={<PieChart className="size-7" />} title="কোনো খরচ নেই" />
          ) : (
            <ul className="flex flex-col gap-3">
              {data.expense_by_category.map((e) => (
                <li key={e.category}>
                  <div className="mb-1 flex justify-between gap-2 text-sm">
                    <span>
                      {EXPENSE_CATEGORY_EMOJI[e.category]} {EXPENSE_CATEGORY_LABEL[e.category]}
                    </span>
                    <b>{formatMoney(e.amount)}</b>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-line-2">
                    <div className="h-full rounded-full bg-expense/80" style={{ width: `${(e.amount / Math.max(1, totalExpense)) * 100}%` }} />
                  </div>
                </li>
              ))}
            </ul>
          )}
        </Section>
      </div>
    </div>
  );
}
