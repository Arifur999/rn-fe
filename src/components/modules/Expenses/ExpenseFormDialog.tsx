"use client";

import { createExpenseAction, updateExpenseAction } from "@/app/(dashboardLayout)/expenses/_action";
import { Button } from "@/components/ui/Button";
import { Field, Input, MoneyInput, Select, Textarea } from "@/components/ui/Field";
import { Modal } from "@/components/ui/Modal";
import { EXPENSE_CATEGORY_EMOJI, EXPENSE_CATEGORY_LABEL } from "@/constants/bn";
import { useFormState } from "@/hooks/useFormState";
import { cn } from "@/lib/utils";
import type { ExpenseCategory, ICar, IDriver, IExpense } from "@/types";
import { emptyExpenseForm, expenseFormZodSchema, type ExpenseFormValues } from "@/zod/expense.validation";

const toForm = (e: IExpense): ExpenseFormValues => ({
  expense_date: e.expense_date,
  category: e.category,
  amount: String(e.amount),
  car_id: e.car_id ?? "",
  driver_id: e.driver_id ?? "",
  note: e.note ?? "",
});

type Props = { expense?: IExpense; cars: ICar[]; drivers: IDriver[]; today: string; onClose: () => void };

export function ExpenseFormDialog({ expense, cars, drivers, today, onClose }: Props) {
  const form = useFormState(
    expenseFormZodSchema,
    expense ? toForm(expense) : emptyExpenseForm(today),
    (values) => (expense ? updateExpenseAction(expense.id, values) : createExpenseAction(values)),
    onClose,
  );
  const { values, errors, set } = form;

  return (
    <Modal
      open
      onClose={onClose}
      title={expense ? "খরচ বদলান" : "নতুন খরচ"}
      footer={
        <>
          <Button variant="outline" className="flex-1" onClick={onClose}>
            বাতিল
          </Button>
          <Button className="flex-1" pending={form.isPending} onClick={form.submit}>
            {expense ? "সেভ করুন" : "খরচ যোগ করুন"}
          </Button>
        </>
      }
    >
      <form className="flex flex-col gap-4" onSubmit={(e) => (e.preventDefault(), form.submit())}>
        <div>
          <p className="mb-2 text-sm font-semibold">
            খরচের ধরন <span className="text-expense">*</span>
          </p>
          <div className="grid grid-cols-3 gap-2 sm:grid-cols-4" role="radiogroup" aria-label="খরচের ধরন">
            {(Object.keys(EXPENSE_CATEGORY_LABEL) as ExpenseCategory[]).map((c) => (
              <button
                key={c}
                type="button"
                role="radio"
                aria-checked={values.category === c}
                onClick={() => set({ category: c })}
                className={cn(
                  "flex cursor-pointer flex-col items-center gap-0.5 rounded-xl border px-1 py-2 text-xs font-semibold transition-colors",
                  values.category === c ? "border-primary bg-primary-soft text-primary" : "border-line bg-surface text-ink-2 hover:border-primary/40",
                )}
              >
                <span className="text-xl">{EXPENSE_CATEGORY_EMOJI[c]}</span>
                {EXPENSE_CATEGORY_LABEL[c]}
              </button>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="টাকা" htmlFor="ex-amount" required error={errors.amount}>
            <MoneyInput id="ex-amount" autoFocus placeholder="০" value={values.amount} invalid={!!errors.amount} onChange={(e) => set({ amount: e.target.value })} />
          </Field>
          <Field label="তারিখ" htmlFor="ex-date" required error={errors.expense_date}>
            <Input id="ex-date" type="date" value={values.expense_date} invalid={!!errors.expense_date} onChange={(e) => set({ expense_date: e.target.value })} />
          </Field>
          <Field label="কোন গাড়ির জন্য" htmlFor="ex-car" error={errors.car_id}>
            <Select id="ex-car" value={values.car_id} onChange={(e) => set({ car_id: e.target.value })}>
              <option value="">— সাধারণ খরচ —</option>
              {cars.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} ({c.number})
                </option>
              ))}
            </Select>
          </Field>
          <Field
            label="ড্রাইভার"
            htmlFor="ex-driver"
            error={errors.driver_id}
            hint={values.category === "driver_payment" ? "কোন ড্রাইভারকে টাকা দিলেন" : undefined}
          >
            <Select id="ex-driver" value={values.driver_id} onChange={(e) => set({ driver_id: e.target.value })}>
              <option value="">— নেই —</option>
              {drivers.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name}
                </option>
              ))}
            </Select>
          </Field>
        </div>
        <Field label="নোট" htmlFor="ex-note" error={errors.note}>
          <Textarea id="ex-note" placeholder="যেমন: ব্রেক ঠিক করা" value={values.note} onChange={(e) => set({ note: e.target.value })} />
        </Field>
        <button type="submit" hidden />
      </form>
    </Modal>
  );
}
