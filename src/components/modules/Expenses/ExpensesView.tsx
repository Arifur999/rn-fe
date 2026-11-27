"use client";

import { CarFront, Pencil, Plus, Route, Trash2, UserRound, Wallet } from "lucide-react";
import { useState } from "react";
import { deleteExpenseAction } from "@/app/(dashboardLayout)/expenses/_action";
import { Pagination, SelectFilter } from "@/components/shared/Filters";
import { PeriodFilter } from "@/components/shared/PeriodFilter";
import { RowMenu } from "@/components/shared/RowMenu";
import { Button } from "@/components/ui/Button";
import { Card, EmptyState } from "@/components/ui/Card";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { PageHeader } from "@/components/ui/PageHeader";
import { EXPENSE_CATEGORY_EMOJI, EXPENSE_CATEGORY_LABEL } from "@/constants/bn";
import { useRunAction } from "@/hooks/useFormState";
import type { Period } from "@/lib/dates";
import { formatMoney, formatRange, formatShortDate } from "@/lib/format";
import type { ExpenseCategory, ICar, IDriver, IExpense } from "@/types";
import type { PaginationMeta } from "@/types/api.types";
import { ExpenseFormDialog } from "./ExpenseFormDialog";

type Props = {
  expenses: IExpense[];
  meta: PaginationMeta;
  cars: ICar[];
  drivers: IDriver[];
  period: Period;
  filters: { category: string; car: string; driver: string };
  today: string;
};

export function ExpensesView({ expenses, meta, cars, drivers, period, filters, today }: Props) {
  const [editing, setEditing] = useState<IExpense | "new" | null>(null);
  const [deleting, setDeleting] = useState<IExpense | null>(null);
  const remove = useRunAction();

  const summary = meta.summary ?? {};
  const byCategory = (Object.keys(EXPENSE_CATEGORY_LABEL) as ExpenseCategory[])
    .filter((c) => (summary[c] ?? 0) > 0)
    .sort((a, b) => (summary[b] ?? 0) - (summary[a] ?? 0));

  return (
    <div className="flex flex-col gap-4">
      <PageHeader
        title="খরচ"
        subtitle={formatRange(period.from, period.to)}
        action={
          <Button onClick={() => setEditing("new")}>
            <Plus className="size-5" /> নতুন খরচ
          </Button>
        }
      />
      <PeriodFilter period={period} />
      <div className="flex flex-wrap gap-2">
        <SelectFilter
          param="category"
          label="ধরন"
          value={filters.category}
          allLabel="সব ধরন"
          options={(Object.keys(EXPENSE_CATEGORY_LABEL) as ExpenseCategory[]).map((c) => ({ value: c, label: EXPENSE_CATEGORY_LABEL[c] }))}
        />
        <SelectFilter param="car" label="গাড়ি" value={filters.car} allLabel="সব গাড়ি" options={cars.map((c) => ({ value: c.id, label: c.name }))} />
        <SelectFilter param="driver" label="ড্রাইভার" value={filters.driver} allLabel="সব ড্রাইভার" options={drivers.map((d) => ({ value: d.id, label: d.name }))} />
      </div>

      <Card className="flex flex-col gap-3 p-4">
        <div className="flex items-center gap-3">
          <div className="grid size-11 place-items-center rounded-xl bg-expense-soft text-expense">
            <Wallet className="size-5" />
          </div>
          <div>
            <p className="text-sm text-ink-2">মোট খরচ</p>
            <p className="text-xl font-bold text-expense">{formatMoney(summary.total ?? 0)}</p>
          </div>
        </div>
        {byCategory.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {byCategory.map((c) => (
              <span key={c} className="inline-flex items-center gap-1 rounded-full bg-surface-2 px-3 py-1 text-sm">
                {EXPENSE_CATEGORY_EMOJI[c]} {EXPENSE_CATEGORY_LABEL[c]} <b className="ml-0.5">{formatMoney(summary[c] ?? 0)}</b>
              </span>
            ))}
          </div>
        ) : null}
      </Card>

      {expenses.length === 0 ? (
        <Card>
          <EmptyState
            icon={<Wallet className="size-7" />}
            title="এই সময়ে কোনো খরচ নেই"
            action={
              <Button onClick={() => setEditing("new")}>
                <Plus className="size-5" /> খরচ যোগ করুন
              </Button>
            }
          />
        </Card>
      ) : (
        <Card className="divide-y divide-line-2">
          {expenses.map((e) => (
            <div key={e.id} className="flex items-center gap-3 px-4 py-3">
              <div className="grid size-11 shrink-0 place-items-center rounded-xl bg-surface-2 text-xl">{EXPENSE_CATEGORY_EMOJI[e.category]}</div>
              <div className="min-w-0 flex-1">
                <p className="font-semibold">
                  {EXPENSE_CATEGORY_LABEL[e.category]}
                  {e.note ? <span className="font-normal text-ink-2"> · {e.note}</span> : null}
                </p>
                <p className="flex flex-wrap items-center gap-x-2.5 text-xs text-ink-2">
                  <span>{formatShortDate(e.expense_date)}</span>
                  {e.car ? (
                    <span className="inline-flex items-center gap-1">
                      <CarFront className="size-3.5" />
                      {e.car.name}
                    </span>
                  ) : null}
                  {e.driver ? (
                    <span className="inline-flex items-center gap-1">
                      <UserRound className="size-3.5" />
                      {e.driver.name}
                    </span>
                  ) : null}
                  {e.trip ? (
                    <span className="inline-flex items-center gap-1">
                      <Route className="size-3.5" />
                      {e.trip.from_place} → {e.trip.to_place}
                    </span>
                  ) : null}
                </p>
              </div>
              <p className="shrink-0 font-bold text-expense">{formatMoney(e.amount)}</p>
              <RowMenu
                items={[
                  { label: "বদলান", icon: <Pencil className="size-4" />, onSelect: () => setEditing(e) },
                  { label: "মুছে ফেলুন", icon: <Trash2 className="size-4" />, onSelect: () => setDeleting(e), danger: true },
                ]}
              />
            </div>
          ))}
        </Card>
      )}
      <Pagination page={meta.page} totalPage={meta.totalPage} />

      {editing ? (
        <ExpenseFormDialog
          expense={editing === "new" ? undefined : editing}
          cars={cars}
          drivers={drivers}
          today={today}
          onClose={() => setEditing(null)}
        />
      ) : null}
      <ConfirmDialog
        open={!!deleting}
        title="খরচ মুছে ফেলবেন?"
        message={deleting ? `${EXPENSE_CATEGORY_LABEL[deleting.category]} — ${formatMoney(deleting.amount)} হিসাব থেকে বাদ যাবে।` : ""}
        pending={remove.isPending}
        onClose={() => setDeleting(null)}
        onConfirm={() => deleting && remove.run(() => deleteExpenseAction(deleting.id), () => setDeleting(null))}
      />
    </div>
  );
}
