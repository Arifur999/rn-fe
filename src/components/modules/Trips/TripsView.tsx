"use client";

import { ArrowRight, Clock, HandCoins, Pencil, Phone, Plus, Route, Trash2, UserRound } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { deleteTripAction } from "@/app/(dashboardLayout)/trips/_action";
import { Pagination, SearchFilter, SelectFilter } from "@/components/shared/Filters";
import { PeriodFilter } from "@/components/shared/PeriodFilter";
import { RowMenu } from "@/components/shared/RowMenu";
import { Button } from "@/components/ui/Button";
import { Badge, Card, EmptyState, NumberPlate } from "@/components/ui/Card";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { PageHeader } from "@/components/ui/PageHeader";
import { EXPENSE_CATEGORY_EMOJI, TRIP_STATUS_LABEL, TRIP_STATUS_TONE } from "@/constants/bn";
import { useRunAction } from "@/hooks/useFormState";
import type { Period } from "@/lib/dates";
import { formatDate, formatMoney, formatRange, formatTime, toBnNumber } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { ICar, IDriver, ITrip, TripStatus } from "@/types";
import type { PaginationMeta } from "@/types/api.types";
import { CollectDialog } from "./CollectDialog";
import { TripFormDialog } from "./TripFormDialog";

type Filters = { car: string; driver: string; status: string; due: boolean; q: string };

type Props = {
  trips: ITrip[];
  meta: PaginationMeta;
  cars: ICar[];
  drivers: IDriver[];
  period: Period;
  filters: Filters;
  today: string;
  openNew: boolean;
};

export function TripsView({ trips, meta, cars, drivers, period, filters, today, openNew }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [editing, setEditing] = useState<ITrip | null>(null);
  const [collecting, setCollecting] = useState<ITrip | null>(null);
  const [deleting, setDeleting] = useState<ITrip | null>(null);
  const [creating, setCreating] = useState(false);
  const remove = useRunAction();

  // ?new=1 (the floating button) opens the form; closing removes it from the URL.
  const showNew = creating || openNew;
  const closeNew = () => {
    setCreating(false);
    if (openNew) {
      const next = new URLSearchParams(searchParams.toString());
      next.delete("new");
      router.replace(next.size ? `${pathname}?${next}` : pathname, { scroll: false });
    }
  };

  const s = meta.summary ?? {};
  const summary = [
    { label: "ট্রিপ", value: `${toBnNumber(s.trips ?? 0)}টি`, cls: "text-ink" },
    { label: "মোট ভাড়া", value: formatMoney(s.fare ?? 0), cls: "text-ink" },
    { label: "পেয়েছি", value: formatMoney(s.paid ?? 0), cls: "text-income" },
    { label: "বাকি", value: formatMoney(s.due ?? 0), cls: "text-due" },
  ];

  return (
    <div className="flex flex-col gap-4">
      <PageHeader
        title="ট্রিপ"
        subtitle={formatRange(period.from, period.to)}
        action={
          <Button onClick={() => setCreating(true)} className="hidden sm:inline-flex">
            <Plus className="size-5" /> নতুন ট্রিপ
          </Button>
        }
      />
      <PeriodFilter period={period} />

      <div className="flex flex-wrap items-center gap-2">
        <SearchFilter value={filters.q} placeholder="জায়গা বা কাস্টমার খুঁজুন" />
        <SelectFilter param="car" label="গাড়ি" value={filters.car} allLabel="সব গাড়ি" options={cars.map((c) => ({ value: c.id, label: c.name }))} />
        <SelectFilter param="driver" label="ড্রাইভার" value={filters.driver} allLabel="সব ড্রাইভার" options={drivers.map((d) => ({ value: d.id, label: d.name }))} />
        <SelectFilter
          param="status"
          label="অবস্থা"
          value={filters.status}
          allLabel="সব অবস্থা"
          options={(Object.keys(TRIP_STATUS_LABEL) as TripStatus[]).map((st) => ({ value: st, label: TRIP_STATUS_LABEL[st] }))}
        />
        <DueToggle active={filters.due} />
      </div>

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {summary.map((x) => (
          <div key={x.label} className="rounded-2xl border border-line/70 bg-surface px-3.5 py-2.5 shadow-card">
            <p className="text-xs text-ink-2">{x.label}</p>
            <p className={cn("text-lg font-bold", x.cls)}>{x.value}</p>
          </div>
        ))}
      </div>

      {trips.length === 0 ? (
        <Card>
          <EmptyState
            icon={<Route className="size-7" />}
            title="কোনো ট্রিপ পাওয়া যায়নি"
            text="অন্য তারিখ বা ফিল্টার বাছাই করুন, অথবা নতুন ট্রিপ যোগ করুন।"
            action={
              <Button onClick={() => setCreating(true)}>
                <Plus className="size-5" /> নতুন ট্রিপ
              </Button>
            }
          />
        </Card>
      ) : (
        <div className="grid gap-3 md:grid-cols-2">
          {trips.map((trip) => (
            <TripCard
              key={trip.id}
              trip={trip}
              onEdit={() => setEditing(trip)}
              onCollect={() => setCollecting(trip)}
              onDelete={() => setDeleting(trip)}
            />
          ))}
        </div>
      )}
      <Pagination page={meta.page} totalPage={meta.totalPage} />

      {showNew ? <TripFormDialog cars={cars} drivers={drivers} today={today} onClose={closeNew} /> : null}
      {editing ? <TripFormDialog trip={editing} cars={cars} drivers={drivers} today={today} onClose={() => setEditing(null)} /> : null}
      {collecting ? <CollectDialog trip={collecting} onClose={() => setCollecting(null)} /> : null}
      <ConfirmDialog
        open={!!deleting}
        title="ট্রিপ মুছে ফেলবেন?"
        message="এই ট্রিপ আর এর সাথে দেওয়া খরচগুলো হিসাব থেকে বাদ যাবে।"
        pending={remove.isPending}
        onClose={() => setDeleting(null)}
        onConfirm={() => deleting && remove.run(() => deleteTripAction(deleting.id), () => setDeleting(null))}
      />
    </div>
  );
}

function DueToggle({ active }: { active: boolean }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const toggle = () => {
    const next = new URLSearchParams(searchParams.toString());
    if (active) next.delete("due");
    else next.set("due", "1");
    next.delete("page");
    router.replace(next.size ? `${pathname}?${next}` : pathname, { scroll: false });
  };
  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={active}
      className={cn(
        "inline-flex h-10 cursor-pointer items-center gap-1.5 rounded-xl border px-3 text-sm font-medium",
        active ? "border-due bg-due-soft text-due" : "border-line bg-surface text-ink-2",
      )}
    >
      <HandCoins className="size-4" /> শুধু বাকি
    </button>
  );
}

function TripCard({ trip, onEdit, onCollect, onDelete }: { trip: ITrip; onEdit: () => void; onCollect: () => void; onDelete: () => void }) {
  const cancelled = trip.status === "cancelled";
  return (
    <Card className={cn("flex flex-col gap-3 p-4", cancelled && "opacity-70")}>
      <div className="flex items-start gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2 text-xs text-ink-2">
            <span className="font-semibold">{formatDate(trip.trip_date)}</span>
            {trip.out_time ? (
              <span className="inline-flex items-center gap-1">
                <Clock className="size-3.5" />
                {formatTime(trip.out_time)}
                {trip.return_time ? ` – ${formatTime(trip.return_time)}` : ""}
              </span>
            ) : null}
            <Badge tone={TRIP_STATUS_TONE[trip.status]}>{TRIP_STATUS_LABEL[trip.status]}</Badge>
          </div>
          <p className="mt-1 flex items-center gap-2 text-[17px] font-bold">
            <span className="truncate">{trip.from_place}</span>
            <ArrowRight className="size-4 shrink-0 text-accent" />
            <span className="truncate">{trip.to_place}</span>
          </p>
        </div>
        <RowMenu
          items={[
            { label: "বদলান", icon: <Pencil className="size-4" />, onSelect: onEdit },
            { label: "মুছে ফেলুন", icon: <Trash2 className="size-4" />, onSelect: onDelete, danger: true },
          ]}
        />
      </div>

      <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-sm text-ink-2">
        <NumberPlate number={trip.car.number} className="text-xs" />
        <span className="inline-flex items-center gap-1">
          <UserRound className="size-4" /> {trip.driver.name}
        </span>
        {trip.customer_name || trip.customer_phone ? (
          <span className="inline-flex items-center gap-1">
            <Phone className="size-3.5" />
            {trip.customer_name}
            {trip.customer_phone ? (
              <a href={`tel:${trip.customer_phone}`} className="text-primary">
                {toBnNumber(trip.customer_phone)}
              </a>
            ) : null}
          </span>
        ) : null}
      </div>

      {trip.expenses.length > 0 ? (
        <p className="text-xs text-ink-2">
          খরচ: {trip.expenses.map((e) => `${EXPENSE_CATEGORY_EMOJI[e.category]} ${formatMoney(e.amount)}`).join("  ")}
        </p>
      ) : null}

      <div className="flex items-center gap-2 border-t border-line-2 pt-3">
        <div className="grid flex-1 grid-cols-3 gap-1 text-center">
          <div>
            <p className="text-[11px] text-ink-3">ভাড়া</p>
            <p className="text-sm font-bold">{formatMoney(trip.fare)}</p>
          </div>
          <div>
            <p className="text-[11px] text-ink-3">পেয়েছি</p>
            <p className="text-sm font-bold text-income">{formatMoney(trip.paid)}</p>
          </div>
          <div>
            <p className="text-[11px] text-ink-3">বাকি</p>
            <p className={cn("text-sm font-bold", trip.due > 0 ? "text-due" : "text-ink-3")}>{formatMoney(trip.due)}</p>
          </div>
        </div>
        {trip.due > 0 ? (
          <Button size="sm" variant="accent" onClick={onCollect}>
            <HandCoins className="size-4" /> বাকি জমা
          </Button>
        ) : null}
      </div>
    </Card>
  );
}
