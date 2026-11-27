"use client";

import { Eye, EyeOff, KeyRound, Mail, Plus, Power, ShieldCheck, Trash2, UserRound } from "lucide-react";
import { useState } from "react";
import { createUserAction, deleteUserAction, resetUserPasswordAction, setUserActiveAction } from "@/app/(dashboardLayout)/users/_action";
import { RowMenu, type RowMenuItem } from "@/components/shared/RowMenu";
import { Button } from "@/components/ui/Button";
import { Badge, Card } from "@/components/ui/Card";
import { ChoiceChips, Field, Input } from "@/components/ui/Field";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { Modal } from "@/components/ui/Modal";
import { PageHeader } from "@/components/ui/PageHeader";
import { useFormState, useRunAction } from "@/hooks/useFormState";
import { formatDate, toBnNumber } from "@/lib/format";
import type { IUser, Role } from "@/types";
import { resetPasswordFormZodSchema, userFormZodSchema } from "@/zod/user.validation";

export const ROLE_LABEL: Record<Role, string> = { super_admin: "সুপার অ্যাডমিন", owner: "মালিক (মেইন ইউজার)" };

function PasswordInput({ id, value, invalid, onChange }: { id: string; value: string; invalid?: boolean; onChange: (v: string) => void }) {
  const [show, setShow] = useState(true);
  return (
    <div className="relative">
      <Input id={id} type={show ? "text" : "password"} autoComplete="new-password" className="pr-11" value={value} invalid={invalid} onChange={(e) => onChange(e.target.value)} />
      <button
        type="button"
        onClick={() => setShow((s) => !s)}
        className="absolute top-1/2 right-1.5 grid size-9 -translate-y-1/2 cursor-pointer place-items-center rounded-lg text-ink-3 hover:text-ink"
        aria-label={show ? "পাসওয়ার্ড লুকান" : "পাসওয়ার্ড দেখুন"}
      >
        {show ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
      </button>
    </div>
  );
}

function CreateUserDialog({ onClose }: { onClose: () => void }) {
  const form = useFormState(userFormZodSchema, { name: "", email: "", password: "", role: "owner" }, createUserAction, onClose);
  const { values, errors, set } = form;
  return (
    <Modal
      open
      onClose={onClose}
      title="নতুন অ্যাকাউন্ট"
      description="এই ইমেইল আর পাসওয়ার্ড দিয়ে লগইন করবে"
      footer={
        <>
          <Button variant="outline" className="flex-1" onClick={onClose}>
            বাতিল
          </Button>
          <Button className="flex-1" pending={form.isPending} onClick={form.submit}>
            অ্যাকাউন্ট তৈরি করুন
          </Button>
        </>
      }
    >
      <form className="flex flex-col gap-4" onSubmit={(e) => (e.preventDefault(), form.submit())}>
        <Field label="নাম" htmlFor="u-name" required error={errors.name}>
          <Input id="u-name" autoFocus value={values.name} invalid={!!errors.name} onChange={(e) => set({ name: e.target.value })} />
        </Field>
        <Field label="ইমেইল" htmlFor="u-email" required error={errors.email}>
          <Input id="u-email" type="email" inputMode="email" autoComplete="off" value={values.email} invalid={!!errors.email} onChange={(e) => set({ email: e.target.value })} />
        </Field>
        <Field label="পাসওয়ার্ড" htmlFor="u-pass" required error={errors.password} hint="কমপক্ষে ৬ অক্ষর। পরে নিজে পরিবর্তন করতে পারবে।">
          <PasswordInput id="u-pass" value={values.password} invalid={!!errors.password} onChange={(password) => set({ password })} />
        </Field>
        <Field label="ভূমিকা" htmlFor="u-role">
          <ChoiceChips
            name="ভূমিকা"
            value={values.role}
            onChange={(role: Role) => set({ role })}
            options={[
              { value: "owner", label: ROLE_LABEL.owner },
              { value: "super_admin", label: ROLE_LABEL.super_admin },
            ]}
          />
        </Field>
        <p className="rounded-xl bg-surface-2 px-3 py-2 text-[13px] text-ink-2">
          মালিক সব হিসাব দেখতে ও লিখতে পারবে। শুধু সুপার অ্যাডমিন এই &quot;ইউজার&quot; পাতা দেখতে পারবে।
        </p>
        <button type="submit" hidden />
      </form>
    </Modal>
  );
}

function ResetPasswordDialog({ user, onClose }: { user: IUser; onClose: () => void }) {
  const form = useFormState(resetPasswordFormZodSchema, { password: "" }, (values) => resetUserPasswordAction(user.id, values), onClose);
  return (
    <Modal
      open
      onClose={onClose}
      size="sm"
      title="নতুন পাসওয়ার্ড দিন"
      description={`${user.name} (${user.email}) — সব ফোন থেকে লগআউট হয়ে যাবে`}
      footer={
        <>
          <Button variant="outline" className="flex-1" onClick={onClose}>
            বাতিল
          </Button>
          <Button className="flex-1" pending={form.isPending} onClick={form.submit}>
            সেট করুন
          </Button>
        </>
      }
    >
      <form onSubmit={(e) => (e.preventDefault(), form.submit())}>
        <Field label="নতুন পাসওয়ার্ড" htmlFor="reset-pass" required error={form.errors.password}>
          <PasswordInput id="reset-pass" value={form.values.password} invalid={!!form.errors.password} onChange={(password) => form.set({ password })} />
        </Field>
      </form>
    </Modal>
  );
}

export function UsersView({ users, myEmail }: { users: IUser[]; myEmail: string }) {
  const [creating, setCreating] = useState(false);
  const [resetting, setResetting] = useState<IUser | null>(null);
  const [deleting, setDeleting] = useState<IUser | null>(null);
  const action = useRunAction();

  return (
    <div className="flex flex-col gap-5">
      <PageHeader
        title="ইউজার"
        subtitle={`কে কে লগইন করতে পারে · মোট ${toBnNumber(users.length)}টি অ্যাকাউন্ট`}
        action={
          <Button onClick={() => setCreating(true)}>
            <Plus className="size-5" /> নতুন অ্যাকাউন্ট
          </Button>
        }
      />

      <div className="grid gap-3 md:grid-cols-2">
        {users.map((user) => {
          const isMe = user.email === myEmail;
          const items: RowMenuItem[] = [
            { label: "পাসওয়ার্ড রিসেট", icon: <KeyRound className="size-4" />, onSelect: () => setResetting(user) },
          ];
          if (!isMe) {
            items.push({
              label: user.is_active ? "অ্যাকাউন্ট বন্ধ করুন" : "অ্যাকাউন্ট চালু করুন",
              icon: <Power className="size-4" />,
              onSelect: () => action.run(() => setUserActiveAction(user.id, !user.is_active)),
            });
            items.push({ label: "মুছে ফেলুন", icon: <Trash2 className="size-4" />, onSelect: () => setDeleting(user), danger: true });
          }
          return (
            <Card key={user.id} className="flex items-start gap-3 p-4">
              <div
                className={
                  user.role === "super_admin"
                    ? "grid size-12 shrink-0 place-items-center rounded-full bg-profit-soft text-profit"
                    : "grid size-12 shrink-0 place-items-center rounded-full bg-primary-soft text-primary"
                }
              >
                {user.role === "super_admin" ? <ShieldCheck className="size-6" /> : <UserRound className="size-6" />}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-base font-bold">
                  {user.name || ROLE_LABEL[user.role]} {isMe ? <span className="text-sm font-normal text-ink-3">(আপনি)</span> : null}
                </p>
                <p className="flex items-center gap-1 truncate text-sm text-ink-2">
                  <Mail className="size-3.5 shrink-0" />
                  {user.email}
                </p>
                <div className="mt-2 flex flex-wrap gap-2">
                  <Badge tone={user.role === "super_admin" ? "purple" : "blue"}>{ROLE_LABEL[user.role]}</Badge>
                  <Badge tone={user.is_active ? "green" : "red"}>{user.is_active ? "চালু" : "বন্ধ"}</Badge>
                </div>
                <p className="mt-2 text-xs text-ink-3">তৈরি: {formatDate(user.created_at.slice(0, 10))}</p>
              </div>
              <RowMenu items={items} />
            </Card>
          );
        })}
      </div>

      {creating ? <CreateUserDialog onClose={() => setCreating(false)} /> : null}
      {resetting ? <ResetPasswordDialog user={resetting} onClose={() => setResetting(null)} /> : null}
      <ConfirmDialog
        open={!!deleting}
        title="অ্যাকাউন্ট মুছে ফেলবেন?"
        message={`${deleting?.email} আর লগইন করতে পারবে না। ব্যবসার হিসাব মুছবে না।`}
        pending={action.isPending}
        onClose={() => setDeleting(null)}
        onConfirm={() => deleting && action.run(() => deleteUserAction(deleting.id), () => setDeleting(null))}
      />
    </div>
  );
}
