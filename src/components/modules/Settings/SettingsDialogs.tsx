"use client";

import { changePasswordAction, updateSettingsAction } from "@/app/_actions/auth.action";
import { Button } from "@/components/ui/Button";
import { Field, Input } from "@/components/ui/Field";
import { Modal } from "@/components/ui/Modal";
import { useFormState } from "@/hooks/useFormState";
import { changePasswordFormZodSchema, settingsFormZodSchema } from "@/zod/auth.validation";

export function SettingsDialog({ businessName, onClose }: { businessName: string; onClose: () => void }) {
  const form = useFormState(settingsFormZodSchema, { business_name: businessName }, updateSettingsAction, onClose);
  return (
    <Modal
      open
      onClose={onClose}
      title="ব্যবসার নাম"
      description="উপরে আর মেনুতে এই নাম দেখাবে"
      size="sm"
      footer={
        <>
          <Button variant="outline" className="flex-1" onClick={onClose}>
            বাতিল
          </Button>
          <Button className="flex-1" pending={form.isPending} onClick={form.submit}>
            সেভ করুন
          </Button>
        </>
      }
    >
      <form onSubmit={(e) => (e.preventDefault(), form.submit())}>
        <Field label="ব্যবসার নাম" htmlFor="bs-name" required error={form.errors.business_name}>
          <Input
            id="bs-name"
            autoFocus
            maxLength={80}
            value={form.values.business_name}
            invalid={!!form.errors.business_name}
            onChange={(e) => form.set({ business_name: e.target.value })}
          />
        </Field>
      </form>
    </Modal>
  );
}

export function PasswordDialog({ onClose }: { onClose: () => void }) {
  const form = useFormState(
    changePasswordFormZodSchema,
    { current_password: "", new_password: "", confirm_password: "" },
    changePasswordAction,
    onClose,
  );
  const fields = [
    { key: "current_password", label: "বর্তমান পাসওয়ার্ড", auto: "current-password" },
    { key: "new_password", label: "নতুন পাসওয়ার্ড", auto: "new-password" },
    { key: "confirm_password", label: "নতুন পাসওয়ার্ড আবার দিন", auto: "new-password" },
  ] as const;

  return (
    <Modal
      open
      onClose={onClose}
      title="পাসওয়ার্ড পরিবর্তন"
      description="পরিবর্তনের পর অন্য সব ফোন/কম্পিউটার থেকে লগআউট হয়ে যাবে"
      size="sm"
      footer={
        <>
          <Button variant="outline" className="flex-1" onClick={onClose}>
            বাতিল
          </Button>
          <Button className="flex-1" pending={form.isPending} onClick={form.submit}>
            পরিবর্তন করুন
          </Button>
        </>
      }
    >
      <form className="flex flex-col gap-4" onSubmit={(e) => (e.preventDefault(), form.submit())}>
        {fields.map(({ key, label, auto }) => (
          <Field key={key} label={label} htmlFor={`pw-${key}`} required error={form.errors[key]}>
            <Input
              id={`pw-${key}`}
              type="password"
              autoComplete={auto}
              value={form.values[key]}
              invalid={!!form.errors[key]}
              onChange={(e) => form.set({ [key]: e.target.value })}
            />
          </Field>
        ))}
        <button type="submit" hidden />
      </form>
    </Modal>
  );
}
