"use client";

import { createDriverAction, updateDriverAction } from "@/app/(dashboardLayout)/drivers/_action";
import { Button } from "@/components/ui/Button";
import { ChoiceChips, Field, Input, Select, Textarea } from "@/components/ui/Field";
import { Modal } from "@/components/ui/Modal";
import { DRIVER_STATUS_LABEL } from "@/constants/bn";
import { useFormState } from "@/hooks/useFormState";
import type { DriverStatus, ICar, IDriver } from "@/types";
import { driverFormZodSchema, emptyDriverForm, type DriverFormValues } from "@/zod/driver.validation";

const toForm = (d: IDriver): DriverFormValues => ({
  name: d.name,
  phone: d.phone,
  license_number: d.license_number ?? "",
  address: d.address ?? "",
  joined_at: d.joined_at ?? "",
  default_car_id: d.default_car_id ?? "",
  status: d.status,
  note: d.note ?? "",
});

export function DriverFormDialog({ driver, cars, onClose }: { driver?: IDriver; cars: ICar[]; onClose: () => void }) {
  const form = useFormState(
    driverFormZodSchema,
    driver ? toForm(driver) : emptyDriverForm,
    (values) => (driver ? updateDriverAction(driver.id, values) : createDriverAction(values)),
    onClose,
  );
  const { values, errors, set } = form;

  return (
    <Modal
      open
      onClose={onClose}
      title={driver ? "ড্রাইভারের তথ্য বদলান" : "নতুন ড্রাইভার"}
      footer={
        <>
          <Button variant="outline" className="flex-1" onClick={onClose}>
            বাতিল
          </Button>
          <Button className="flex-1" pending={form.isPending} onClick={form.submit}>
            {driver ? "সেভ করুন" : "ড্রাইভার যোগ করুন"}
          </Button>
        </>
      }
    >
      <form className="grid grid-cols-1 gap-4 sm:grid-cols-2" onSubmit={(e) => (e.preventDefault(), form.submit())}>
        <Field label="নাম" htmlFor="dr-name" required error={errors.name}>
          <Input id="dr-name" autoFocus placeholder="ড্রাইভারের নাম" value={values.name} invalid={!!errors.name} onChange={(e) => set({ name: e.target.value })} />
        </Field>
        <Field label="মোবাইল নম্বর" htmlFor="dr-phone" required error={errors.phone}>
          <Input
            id="dr-phone"
            type="tel"
            inputMode="tel"
            placeholder="01XXXXXXXXX"
            value={values.phone}
            invalid={!!errors.phone}
            onChange={(e) => set({ phone: e.target.value })}
          />
        </Field>
        <Field label="সাধারণত কোন গাড়ি চালান" htmlFor="dr-car" hint="ট্রিপ দেওয়ার সময় গাড়ি নিজে থেকে বাছাই হবে" error={errors.default_car_id}>
          <Select id="dr-car" value={values.default_car_id} onChange={(e) => set({ default_car_id: e.target.value })}>
            <option value="">— নেই —</option>
            {cars.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name} ({c.number})
              </option>
            ))}
          </Select>
        </Field>
        <Field label="লাইসেন্স নম্বর" htmlFor="dr-license" error={errors.license_number}>
          <Input id="dr-license" value={values.license_number} onChange={(e) => set({ license_number: e.target.value })} />
        </Field>
        <Field label="কাজে যোগ দিয়েছেন" htmlFor="dr-joined" error={errors.joined_at}>
          <Input id="dr-joined" type="date" value={values.joined_at} onChange={(e) => set({ joined_at: e.target.value })} />
        </Field>
        <Field label="অবস্থা" htmlFor="dr-status">
          <ChoiceChips
            name="অবস্থা"
            value={values.status}
            onChange={(status: DriverStatus) => set({ status })}
            options={(Object.keys(DRIVER_STATUS_LABEL) as DriverStatus[]).map((s) => ({ value: s, label: DRIVER_STATUS_LABEL[s] }))}
          />
        </Field>
        <Field label="ঠিকানা" htmlFor="dr-address" className="sm:col-span-2" error={errors.address}>
          <Input id="dr-address" value={values.address} onChange={(e) => set({ address: e.target.value })} />
        </Field>
        <Field label="নোট" htmlFor="dr-note" className="sm:col-span-2" error={errors.note}>
          <Textarea id="dr-note" value={values.note} onChange={(e) => set({ note: e.target.value })} />
        </Field>
        <button type="submit" hidden />
      </form>
    </Modal>
  );
}
