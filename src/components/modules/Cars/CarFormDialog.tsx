"use client";

import { createCarAction, updateCarAction } from "@/app/(dashboardLayout)/cars/_action";
import { Button } from "@/components/ui/Button";
import { ChoiceChips, Field, Input, Select, Textarea } from "@/components/ui/Field";
import { Modal } from "@/components/ui/Modal";
import { CAR_STATUS_LABEL, CAR_TYPE_LABEL } from "@/constants/bn";
import { useFormState } from "@/hooks/useFormState";
import type { CarStatus, CarType, ICar } from "@/types";
import { carFormZodSchema, emptyCarForm, type CarFormValues } from "@/zod/car.validation";

const toForm = (car: ICar): CarFormValues => ({
  name: car.name,
  number: car.number,
  type: car.type,
  status: car.status,
  fitness_expiry: car.fitness_expiry ?? "",
  tax_token_expiry: car.tax_token_expiry ?? "",
  insurance_expiry: car.insurance_expiry ?? "",
  route_permit_expiry: car.route_permit_expiry ?? "",
  note: car.note ?? "",
});

const PAPERS = [
  { key: "fitness_expiry", label: "ফিটনেস" },
  { key: "tax_token_expiry", label: "ট্যাক্স টোকেন" },
  { key: "insurance_expiry", label: "ইন্স্যুরেন্স" },
  { key: "route_permit_expiry", label: "রুট পারমিট" },
] as const;

export function CarFormDialog({ car, onClose }: { car?: ICar; onClose: () => void }) {
  const form = useFormState(
    carFormZodSchema,
    car ? toForm(car) : emptyCarForm,
    (values) => (car ? updateCarAction(car.id, values) : createCarAction(values)),
    onClose,
  );
  const { values, errors, set } = form;

  return (
    <Modal
      open
      onClose={onClose}
      title={car ? "গাড়ির তথ্য বদলান" : "নতুন গাড়ি"}
      footer={
        <>
          <Button variant="outline" className="flex-1" onClick={onClose}>
            বাতিল
          </Button>
          <Button className="flex-1" pending={form.isPending} onClick={form.submit}>
            {car ? "সেভ করুন" : "গাড়ি যোগ করুন"}
          </Button>
        </>
      }
    >
      <form className="grid grid-cols-1 gap-4 sm:grid-cols-2" onSubmit={(e) => (e.preventDefault(), form.submit())}>
        <Field label="গাড়ির নাম/মডেল" htmlFor="car-name" required error={errors.name}>
          <Input id="car-name" autoFocus placeholder="যেমন: Toyota Noah" value={values.name} invalid={!!errors.name} onChange={(e) => set({ name: e.target.value })} />
        </Field>
        <Field label="গাড়ির নম্বর" htmlFor="car-number" required error={errors.number}>
          <Input
            id="car-number"
            placeholder="ঢাকা মেট্রো-চ ১২-৩৪৫৬"
            value={values.number}
            invalid={!!errors.number}
            onChange={(e) => set({ number: e.target.value })}
          />
        </Field>
        <Field label="গাড়ির ধরন" htmlFor="car-type" required error={errors.type}>
          <Select id="car-type" value={values.type} onChange={(e) => set({ type: e.target.value as CarType })}>
            {(Object.keys(CAR_TYPE_LABEL) as CarType[]).map((t) => (
              <option key={t} value={t}>
                {CAR_TYPE_LABEL[t]}
              </option>
            ))}
          </Select>
        </Field>
        <Field label="অবস্থা" htmlFor="car-status" error={errors.status}>
          <ChoiceChips
            name="অবস্থা"
            value={values.status}
            onChange={(status: CarStatus) => set({ status })}
            options={(Object.keys(CAR_STATUS_LABEL) as CarStatus[]).map((s) => ({ value: s, label: CAR_STATUS_LABEL[s] }))}
          />
        </Field>

        <div className="rounded-2xl border border-line-2 bg-surface-2 p-3.5 sm:col-span-2">
          <p className="mb-3 text-sm font-semibold">
            কাগজপত্রের মেয়াদ <span className="font-normal text-ink-3">(ঐচ্ছিক — মেয়াদ শেষের আগে ড্যাশবোর্ডে সতর্ক করবে)</span>
          </p>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {PAPERS.map(({ key, label }) => (
              <Field key={key} label={label} htmlFor={`car-${key}`} error={errors[key]}>
                <Input id={`car-${key}`} type="date" value={values[key]} invalid={!!errors[key]} onChange={(e) => set({ [key]: e.target.value })} />
              </Field>
            ))}
          </div>
        </div>

        <Field label="নোট" htmlFor="car-note" className="sm:col-span-2" error={errors.note}>
          <Textarea id="car-note" placeholder="যেকোনো তথ্য" value={values.note} onChange={(e) => set({ note: e.target.value })} />
        </Field>
        <button type="submit" hidden />
      </form>
    </Modal>
  );
}
