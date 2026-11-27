"use client";

import { ArrowDown, Plus, X } from "lucide-react";
import Link from "next/link";
import { createTripAction, updateTripAction } from "@/app/(dashboardLayout)/trips/_action";
import { Button } from "@/components/ui/Button";
import { ChoiceChips, Field, Input, MoneyInput, Select, Textarea } from "@/components/ui/Field";
import { Modal } from "@/components/ui/Modal";
import { EXPENSE_CATEGORY_EMOJI, EXPENSE_CATEGORY_LABEL, TRIP_STATUS_LABEL } from "@/constants/bn";
import { useFormState } from "@/hooks/useFormState";
import { formatMoney } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { ExpenseCategory, ICar, IDriver, ITrip, TripStatus } from "@/types";
import { normalizeDigits } from "@/zod/common";
import { emptyTripForm, tripFormZodSchema, type TripFormValues } from "@/zod/trip.validation";

const toForm = (t: ITrip): TripFormValues => ({
  trip_date: t.trip_date,
  car_id: t.car_id,
  driver_id: t.driver_id,
  from_place: t.from_place,
  to_place: t.to_place,
  customer_name: t.customer_name ?? "",
  customer_phone: t.customer_phone ?? "",
  out_time: t.out_time ?? "",
  return_time: t.return_time ?? "",
  fare: String(t.fare),
  paid: String(t.paid),
  status: t.status,
  note: t.note ?? "",
  expenses: [],
});

const amountOf = (v: string) => {
  const n = Number(normalizeDigits(v));
  return Number.isFinite(n) ? n : 0;
};

// The two costs almost every trip has get a one-tap button.
const QUICK_EXPENSES: ExpenseCategory[] = ["fuel", "toll", "parking", "food"];

type Props = {
  trip?: ITrip;
  cars: ICar[];
  drivers: IDriver[];
  today: string;
  onClose: () => void;
};

export function TripFormDialog({ trip, cars, drivers, today, onClose }: Props) {
  const usableCars = cars.filter((c) => c.status !== "inactive" || c.id === trip?.car_id);
  const usableDrivers = drivers.filter((d) => d.status === "active" || d.id === trip?.driver_id);

  const form = useFormState(
    tripFormZodSchema,
    trip ? toForm(trip) : emptyTripForm(today),
    (values) => (trip ? updateTripAction(trip.id, values) : createTripAction(values)),
    onClose,
  );
  const { values, errors, set } = form;

  // Picking a driver fills in their usual car (and the other way round).
  const pickDriver = (driverId: string) => {
    const driver = drivers.find((d) => d.id === driverId);
    set({ driver_id: driverId, ...(!values.car_id && driver?.default_car_id ? { car_id: driver.default_car_id } : {}) });
  };
  const pickCar = (carId: string) => {
    const driver = drivers.find((d) => d.default_car_id === carId && d.status === "active");
    set({ car_id: carId, ...(!values.driver_id && driver ? { driver_id: driver.id } : {}) });
  };

  const fare = amountOf(values.fare);
  const paid = amountOf(values.paid);
  const due = Math.max(0, fare - paid);
  const expenseTotal = values.expenses.reduce((s, e) => s + amountOf(e.amount), 0);

  const setExpense = (index: number, patch: Partial<TripFormValues["expenses"][number]>) =>
    set({ expenses: values.expenses.map((e, i) => (i === index ? { ...e, ...patch } : e)) });
  const addExpense = (category: ExpenseCategory) => set({ expenses: [...values.expenses, { category, amount: "", note: "" }] });
  const removeExpense = (index: number) => set({ expenses: values.expenses.filter((_, i) => i !== index) });

  const noSetup = cars.length === 0 || drivers.length === 0;

  return (
    <Modal
      open
      onClose={onClose}
      size="lg"
      title={trip ? "ট্রিপ বদলান" : "নতুন ট্রিপ"}
      description={trip ? undefined : "গাড়ি গ্যারেজ থেকে বের হলেই একটা ট্রিপ"}
      footer={
        noSetup ? undefined : (
          <>
            <Button variant="outline" className="flex-1" onClick={onClose}>
              বাতিল
            </Button>
            <Button className="flex-[2]" pending={form.isPending} onClick={form.submit}>
              {trip ? "সেভ করুন" : "ট্রিপ সেভ করুন"}
            </Button>
          </>
        )
      }
    >
      {noSetup ? (
        <div className="flex flex-col items-center gap-3 py-6 text-center">
          <p className="text-4xl">🚗👤</p>
          <p className="font-semibold">ট্রিপ দেওয়ার আগে অন্তত একটা গাড়ি আর একজন ড্রাইভার যোগ করুন।</p>
          <div className="flex gap-2">
            <Link href="/cars" className="rounded-xl bg-primary px-4 py-2.5 font-semibold text-white" onClick={onClose}>
              গাড়ি যোগ করুন
            </Link>
            <Link href="/drivers" className="rounded-xl border border-line px-4 py-2.5 font-semibold" onClick={onClose}>
              ড্রাইভার যোগ করুন
            </Link>
          </div>
        </div>
      ) : (
        <form className="flex flex-col gap-5" onSubmit={(e) => (e.preventDefault(), form.submit())}>
          {/* Who and when */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <Field label="তারিখ" htmlFor="tr-date" required error={errors.trip_date}>
              <Input id="tr-date" type="date" value={values.trip_date} max="2100-01-01" invalid={!!errors.trip_date} onChange={(e) => set({ trip_date: e.target.value })} />
            </Field>
            <Field label="গাড়ি" htmlFor="tr-car" required error={errors.car_id}>
              <Select id="tr-car" value={values.car_id} invalid={!!errors.car_id} onChange={(e) => pickCar(e.target.value)}>
                <option value="">গাড়ি বাছাই করুন</option>
                {usableCars.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} — {c.number}
                  </option>
                ))}
              </Select>
            </Field>
            <Field label="ড্রাইভার" htmlFor="tr-driver" required error={errors.driver_id}>
              <Select id="tr-driver" value={values.driver_id} invalid={!!errors.driver_id} onChange={(e) => pickDriver(e.target.value)}>
                <option value="">ড্রাইভার বাছাই করুন</option>
                {usableDrivers.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name}
                  </option>
                ))}
              </Select>
            </Field>
          </div>

          {/* Route */}
          <div className="rounded-2xl border border-line-2 bg-surface-2 p-3.5">
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-[1fr_auto_1fr] sm:items-end">
              <Field label="কোথা থেকে" htmlFor="tr-from" required error={errors.from_place}>
                <Input id="tr-from" placeholder="যেমন: মিরপুর" value={values.from_place} invalid={!!errors.from_place} onChange={(e) => set({ from_place: e.target.value })} />
              </Field>
              <ArrowDown className="mx-auto size-5 text-ink-3 sm:mb-3 sm:-rotate-90" aria-hidden />
              <Field label="কোথায়" htmlFor="tr-to" required error={errors.to_place}>
                <Input id="tr-to" placeholder="যেমন: কক্সবাজার" value={values.to_place} invalid={!!errors.to_place} onChange={(e) => set({ to_place: e.target.value })} />
              </Field>
            </div>
            <div className="mt-3 grid grid-cols-2 gap-3">
              <Field label="বের হওয়ার সময়" htmlFor="tr-out" error={errors.out_time}>
                <Input id="tr-out" type="time" value={values.out_time} onChange={(e) => set({ out_time: e.target.value })} />
              </Field>
              <Field label="ফেরার সময়" htmlFor="tr-back" error={errors.return_time}>
                <Input id="tr-back" type="time" value={values.return_time} onChange={(e) => set({ return_time: e.target.value })} />
              </Field>
            </div>
          </div>

          {/* Customer and money */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="কাস্টমারের নাম" htmlFor="tr-cname" error={errors.customer_name}>
              <Input id="tr-cname" value={values.customer_name} onChange={(e) => set({ customer_name: e.target.value })} />
            </Field>
            <Field label="কাস্টমারের মোবাইল" htmlFor="tr-cphone" error={errors.customer_phone}>
              <Input id="tr-cphone" type="tel" inputMode="tel" value={values.customer_phone} onChange={(e) => set({ customer_phone: e.target.value })} />
            </Field>
            <Field label="মোট ভাড়া" htmlFor="tr-fare" required error={errors.fare}>
              <MoneyInput id="tr-fare" placeholder="০" value={values.fare} invalid={!!errors.fare} onChange={(e) => set({ fare: e.target.value })} />
            </Field>
            <Field
              label="কাস্টমার থেকে পেয়েছি"
              htmlFor="tr-paid"
              error={errors.paid}
              hint={
                fare > 0 ? (
                  <button type="button" className="cursor-pointer font-semibold text-primary" onClick={() => set({ paid: values.fare })}>
                    পুরো টাকা পেয়েছি
                  </button>
                ) : undefined
              }
            >
              <MoneyInput id="tr-paid" placeholder="০" value={values.paid} invalid={!!errors.paid} onChange={(e) => set({ paid: e.target.value })} />
            </Field>
          </div>
          {fare > 0 ? (
            <div className={cn("-mt-2 rounded-xl px-3.5 py-2.5 text-[15px] font-semibold", due > 0 ? "bg-due-soft text-due" : "bg-income-soft text-income")}>
              {due > 0 ? `বাকি থাকবে ${formatMoney(due)}` : "✓ পুরো টাকা পরিশোধ"}
            </div>
          ) : null}

          <Field label="অবস্থা" htmlFor="tr-status">
            <ChoiceChips
              name="অবস্থা"
              value={values.status}
              onChange={(status: TripStatus) => set({ status })}
              options={(Object.keys(TRIP_STATUS_LABEL) as TripStatus[]).map((s) => ({ value: s, label: TRIP_STATUS_LABEL[s] }))}
            />
          </Field>

          {/* Trip costs (new trips only; editing them happens on the খরচ page) */}
          {trip ? (
            trip.expenses.length > 0 ? (
              <p className="rounded-xl bg-surface-2 px-3.5 py-2.5 text-sm text-ink-2">
                এই ট্রিপের খরচ {formatMoney(trip.expense_total)} — বদলাতে &quot;খরচ&quot; পাতায় যান।
              </p>
            ) : null
          ) : (
            <div className="rounded-2xl border border-dashed border-line p-3.5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="text-sm font-semibold">
                  এই ট্রিপের খরচ <span className="font-normal text-ink-3">(তেল, টোল...)</span>
                </p>
                {expenseTotal > 0 ? <span className="text-sm font-bold text-expense">মোট {formatMoney(expenseTotal)}</span> : null}
              </div>
              {values.expenses.length > 0 ? (
                <ul className="mt-3 flex flex-col gap-2.5">
                  {values.expenses.map((expense, i) => (
                    <li key={i} className="grid grid-cols-[1fr_1fr_auto] items-start gap-2">
                      <Select
                        aria-label="খরচের ধরন"
                        value={expense.category}
                        onChange={(e) => setExpense(i, { category: e.target.value as ExpenseCategory })}
                      >
                        {(Object.keys(EXPENSE_CATEGORY_LABEL) as ExpenseCategory[]).map((c) => (
                          <option key={c} value={c}>
                            {EXPENSE_CATEGORY_EMOJI[c]} {EXPENSE_CATEGORY_LABEL[c]}
                          </option>
                        ))}
                      </Select>
                      <div>
                        <MoneyInput
                          aria-label="খরচের টাকা"
                          placeholder="টাকা"
                          value={expense.amount}
                          invalid={!!errors[`expenses.${i}.amount`]}
                          onChange={(e) => setExpense(i, { amount: e.target.value })}
                        />
                        {errors[`expenses.${i}.amount`] ? <p className="mt-1 text-xs text-expense">{errors[`expenses.${i}.amount`]}</p> : null}
                      </div>
                      <button
                        type="button"
                        onClick={() => removeExpense(i)}
                        className="grid size-11 cursor-pointer place-items-center rounded-xl text-ink-3 hover:bg-expense-soft hover:text-expense"
                        aria-label="খরচ বাদ দিন"
                      >
                        <X className="size-5" />
                      </button>
                    </li>
                  ))}
                </ul>
              ) : null}
              <div className="mt-3 flex flex-wrap gap-2">
                {QUICK_EXPENSES.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => addExpense(c)}
                    className="inline-flex h-9 cursor-pointer items-center gap-1 rounded-full border border-line bg-surface px-3 text-sm font-medium text-ink-2 hover:border-primary/40 hover:text-primary"
                  >
                    <Plus className="size-4" /> {EXPENSE_CATEGORY_EMOJI[c]} {EXPENSE_CATEGORY_LABEL[c]}
                  </button>
                ))}
              </div>
            </div>
          )}

          <Field label="নোট" htmlFor="tr-note" error={errors.note}>
            <Textarea id="tr-note" placeholder="যেকোনো তথ্য" value={values.note} onChange={(e) => set({ note: e.target.value })} />
          </Field>
          <button type="submit" hidden />
        </form>
      )}
    </Modal>
  );
}
