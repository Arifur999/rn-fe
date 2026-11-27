"use client";

import { Eye, EyeOff, LogIn } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { loginAction } from "@/app/_actions/auth.action";
import { Button } from "@/components/ui/Button";
import { Field, Input } from "@/components/ui/Field";
import { useFormState } from "@/hooks/useFormState";
import { loginFormZodSchema } from "@/zod/auth.validation";

export function LoginForm() {
  const router = useRouter();
  const expired = useSearchParams().get("reason") === "expired";
  const [show, setShow] = useState(false);
  const form = useFormState(loginFormZodSchema, { email: "", password: "" }, loginAction, () => {
    router.replace("/dashboard");
  });

  return (
    <form
      className="flex flex-col gap-4 rounded-3xl bg-surface p-6 shadow-pop"
      onSubmit={(e) => {
        e.preventDefault();
        form.submit();
      }}
    >
      {expired ? (
        <p className="rounded-xl bg-due-soft px-3 py-2 text-sm text-due">লগইনের মেয়াদ শেষ হয়েছে, আবার লগইন করুন।</p>
      ) : null}
      <Field label="ইমেইল" htmlFor="email" error={form.errors.email}>
        <Input
          id="email"
          type="email"
          inputMode="email"
          autoComplete="username"
          placeholder="you@example.com"
          value={form.values.email}
          invalid={!!form.errors.email}
          onChange={(e) => form.set({ email: e.target.value })}
        />
      </Field>
      <Field label="পাসওয়ার্ড" htmlFor="password" error={form.errors.password}>
        <div className="relative">
          <Input
            id="password"
            type={show ? "text" : "password"}
            autoComplete="current-password"
            placeholder="••••••••"
            className="pr-11"
            value={form.values.password}
            invalid={!!form.errors.password}
            onChange={(e) => form.set({ password: e.target.value })}
          />
          <button
            type="button"
            onClick={() => setShow((s) => !s)}
            className="absolute top-1/2 right-1.5 grid size-9 -translate-y-1/2 cursor-pointer place-items-center rounded-lg text-ink-3 hover:text-ink"
            aria-label={show ? "পাসওয়ার্ড লুকান" : "পাসওয়ার্ড দেখুন"}
          >
            {show ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
          </button>
        </div>
      </Field>
      <Button type="submit" size="lg" className="mt-1 w-full" pending={form.isPending}>
        <LogIn className="size-5" /> লগইন করুন
      </Button>
    </form>
  );
}
