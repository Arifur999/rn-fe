import { ArrowLeft, ChevronRight, IdCard, Phone, Route } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { PeriodFilter } from "@/components/shared/PeriodFilter";
import { RecentTrips } from "@/components/shared/RecentTrips";
import { TotalsGrid } from "@/components/shared/TotalsGrid";
import { Badge, Section } from "@/components/ui/Card";
import { DRIVER_STATUS_LABEL, DRIVER_STATUS_TONE } from "@/constants/bn";
import { resolvePeriod } from "@/lib/dates";
import { formatDate, formatMoney, formatRange, toBnNumber } from "@/lib/format";
import { loadPage } from "@/lib/loadPage";
import { param, type SearchParams } from "@/lib/pageParams";
import { getDriverSummary } from "@/services/driver.services";

export const metadata: Metadata = { title: "ড্রাইভারের হিসাব" };

export default async function DriverDetailPage({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<SearchParams> }) {
  const { id } = await params;
  const sp = await searchParams;
  const period = resolvePeriod({ period: param(sp, "period"), from: param(sp, "from"), to: param(sp, "to") }, "month");
  const { data } = await loadPage(() => getDriverSummary(id, period));
  const { driver, totals, recent_trips } = data;

  const info = [
    { label: "মোবাইল", value: toBnNumber(driver.phone) },
    { label: "লাইসেন্স", value: driver.license_number },
    { label: "নিয়মিত গাড়ি", value: driver.default_car ? `${driver.default_car.name} (${driver.default_car.number})` : null },
    { label: "যোগ দিয়েছেন", value: driver.joined_at ? formatDate(driver.joined_at) : null },
    { label: "ঠিকানা", value: driver.address },
  ];

  return (
    <div className="flex flex-col gap-5">
      <Link href="/drivers" className="inline-flex w-fit items-center gap-1.5 text-sm font-semibold text-ink-2 hover:text-primary">
        <ArrowLeft className="size-4" /> সব ড্রাইভার
      </Link>
      <div className="flex flex-wrap items-center gap-3">
        <h1 className="text-2xl font-bold sm:text-[28px]">{driver.name}</h1>
        <Badge tone={DRIVER_STATUS_TONE[driver.status]}>{DRIVER_STATUS_LABEL[driver.status]}</Badge>
        <a href={`tel:${driver.phone}`} className="inline-flex items-center gap-1.5 rounded-full bg-income-soft px-3 py-1 text-sm font-semibold text-income">
          <Phone className="size-4" /> কল করুন
        </a>
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
              href={`/trips?driver=${driver.id}&period=${period.key}${period.key === "custom" ? `&from=${period.from}&to=${period.to}` : ""}`}
              className="inline-flex items-center gap-0.5 text-sm font-semibold text-primary"
            >
              সব দেখুন <ChevronRight className="size-4" />
            </Link>
          }
        >
          <RecentTrips trips={recent_trips} show="driver" />
        </Section>

        <Section title="ড্রাইভারের তথ্য" icon={<IdCard className="size-5 text-primary" />}>
          <div className="mb-3 rounded-xl bg-accent-soft px-3.5 py-3">
            <p className="text-sm text-ink-2">এই সময়ে ড্রাইভারকে দেওয়া হয়েছে</p>
            <p className="text-xl font-bold text-accent-hover">{formatMoney(totals.paid_to_driver)}</p>
            <p className="text-xs text-ink-3">খরচ পাতায় &quot;ড্রাইভার পেমেন্ট&quot; হিসেবে যোগ করুন</p>
          </div>
          <dl className="flex flex-col gap-2">
            {info.map(({ label, value }) => (
              <div key={label} className="flex justify-between gap-3 border-b border-line-2 pb-2 text-sm last:border-0">
                <dt className="text-ink-2">{label}</dt>
                <dd className="text-right font-medium">{value || <span className="text-ink-3">—</span>}</dd>
              </div>
            ))}
          </dl>
        </Section>
      </div>
    </div>
  );
}
