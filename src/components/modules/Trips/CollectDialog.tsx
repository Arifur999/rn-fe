"use client";

import { collectTripAction } from "@/app/(dashboardLayout)/trips/_action";
import { Button } from "@/components/ui/Button";
import { Field, MoneyInput } from "@/components/ui/Field";
import { Modal } from "@/components/ui/Modal";
import { useFormState } from "@/hooks/useFormState";
import { formatMoney } from "@/lib/format";
import type { ITrip } from "@/types";
import { collectFormZodSchema } from "@/zod/trip.validation";

/** "বাকি জমা": the customer paid (part of) what was due. */
export function CollectDialog({ trip, onClose }: { trip: ITrip; onClose: () => void }) {
  const form = useFormState(collectFormZodSchema, { amount: String(trip.due) }, (values) => collectTripAction(trip.id, values), onClose);

  return (
    <Modal
      open
      onClose={onClose}
      size="sm"
      title="বাকি টাকা জমা"
      description={`${trip.customer_name ?? "কাস্টমার"} · ${trip.from_place} → ${trip.to_place}`}
      footer={
        <>
          <Button variant="outline" className="flex-1" onClick={onClose}>
            বাতিল
          </Button>
          <Button className="flex-1" pending={form.isPending} onClick={form.submit}>
            জমা করুন
          </Button>
        </>
      }
    >
      <div className="mb-4 grid grid-cols-3 gap-2 text-center">
        {[
          { label: "ভাড়া", value: trip.fare, cls: "text-ink" },
          { label: "পেয়েছি", value: trip.paid, cls: "text-income" },
          { label: "বাকি", value: trip.due, cls: "text-due" },
        ].map((x) => (
          <div key={x.label} className="rounded-xl bg-surface-2 py-2">
            <p className="text-xs text-ink-2">{x.label}</p>
            <p className={`font-bold ${x.cls}`}>{formatMoney(x.value)}</p>
          </div>
        ))}
      </div>
      <form onSubmit={(e) => (e.preventDefault(), form.submit())}>
        <Field label="কত টাকা পেলেন" htmlFor="collect-amount" required error={form.errors.amount}>
          <MoneyInput
            id="collect-amount"
            autoFocus
            value={form.values.amount}
            invalid={!!form.errors.amount}
            onChange={(e) => form.set({ amount: e.target.value })}
          />
        </Field>
      </form>
    </Modal>
  );
}
