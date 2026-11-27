import type { Metadata } from "next";
import { Suspense } from "react";
import { Credit } from "@/components/layout/Credit";
import { LoginForm } from "@/components/modules/Auth/LoginForm";
import { APP_NAME } from "@/constants/bn";

export const metadata: Metadata = { title: "লগইন" };

export default function LoginPage() {
  return (
    <div className="relative flex min-h-dvh flex-col overflow-hidden bg-sidebar">
      {/* soft road-light glows */}
      <div className="pointer-events-none absolute -top-40 -left-32 size-[28rem] rounded-full bg-primary/40 blur-3xl" aria-hidden />
      <div className="pointer-events-none absolute -right-24 -bottom-40 size-[24rem] rounded-full bg-accent/25 blur-3xl" aria-hidden />

      <div className="relative flex flex-1 items-center justify-center px-4 py-10">
        <div className="w-full max-w-sm">
          <div className="mb-7 flex flex-col items-center text-center">
            <div className="mb-4 grid size-16 place-items-center rounded-2xl bg-accent text-4xl shadow-fab">🚗</div>
            <h1 className="text-2xl font-bold text-white">{APP_NAME}</h1>
            <p className="mt-1 text-sm text-white/60">গাড়ি, ড্রাইভার, ট্রিপ আর খরচের সহজ হিসাব</p>
          </div>
          <Suspense>
            <LoginForm />
          </Suspense>
        </div>
      </div>
      <Credit className="relative text-white/50 [&_a]:text-white/80" />
    </div>
  );
}
