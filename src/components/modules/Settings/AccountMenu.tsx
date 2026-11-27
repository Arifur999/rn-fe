"use client";

import { KeyRound, LogOut, Settings, ShieldCheck, UserRound } from "lucide-react";
import { DropdownMenu } from "radix-ui";
import { useRouter } from "next/navigation";
import type { IAdmin } from "@/types";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { logoutAction } from "@/app/_actions/auth.action";
import { cn } from "@/lib/utils";
import { PasswordDialog, SettingsDialog } from "./SettingsDialogs";

export function AccountMenu({ admin, dark }: { admin: IAdmin; dark?: boolean }) {
  const { email, business_name: businessName } = admin;
  const isSuperAdmin = admin.role === "super_admin";
  const displayName = admin.name || (isSuperAdmin ? "সুপার অ্যাডমিন" : "মালিক");
  const router = useRouter();
  const [open, setOpen] = useState<null | "settings" | "password">(null);
  const [isPending, startTransition] = useTransition();

  const logout = () =>
    startTransition(async () => {
      await logoutAction();
      toast.success("লগআউট হয়েছে");
      router.replace("/login");
      router.refresh();
    });

  const item = "flex cursor-pointer items-center gap-2.5 rounded-lg px-3 py-2.5 text-[15px] outline-none data-[highlighted]:bg-line-2";

  return (
    <>
      <DropdownMenu.Root>
        <DropdownMenu.Trigger
          className={cn(
            "flex min-w-0 cursor-pointer items-center gap-2.5 rounded-xl p-1.5 text-left outline-none focus-visible:ring-2 focus-visible:ring-accent",
            dark ? "w-full hover:bg-white/6" : "hover:bg-line-2",
          )}
          aria-label="অ্যাকাউন্ট মেনু"
        >
          <span className={cn("grid size-9 shrink-0 place-items-center rounded-full", dark ? "bg-white/10 text-white" : "bg-primary-soft text-primary")}>
            <UserRound className="size-5" />
          </span>
          {dark ? (
            <span className="min-w-0">
              <span className="block truncate text-sm font-semibold text-white">{displayName}</span>
              <span className="block truncate text-xs text-white/55">{email}</span>
            </span>
          ) : null}
        </DropdownMenu.Trigger>
        <DropdownMenu.Portal>
          <DropdownMenu.Content
            align="end"
            sideOffset={8}
            className="animate-fade-in z-50 min-w-56 rounded-2xl border border-line bg-surface p-1.5 text-ink shadow-pop"
          >
            <div className="px-3 py-2">
              <p className="text-sm font-semibold">{displayName}</p>
              <p className="truncate text-xs text-ink-3">{email}</p>
            </div>
            <DropdownMenu.Separator className="my-1 h-px bg-line-2" />
            {isSuperAdmin ? (
              <DropdownMenu.Item className={item} onSelect={() => router.push("/users")}>
                <ShieldCheck className="size-4.5 text-profit" /> ইউজার (অ্যাকাউন্ট তৈরি)
              </DropdownMenu.Item>
            ) : null}
            <DropdownMenu.Item className={item} onSelect={() => setOpen("settings")}>
              <Settings className="size-4.5 text-ink-2" /> ব্যবসার নাম
            </DropdownMenu.Item>
            <DropdownMenu.Item className={item} onSelect={() => setOpen("password")}>
              <KeyRound className="size-4.5 text-ink-2" /> পাসওয়ার্ড পরিবর্তন
            </DropdownMenu.Item>
            <DropdownMenu.Separator className="my-1 h-px bg-line-2" />
            <DropdownMenu.Item className={cn(item, "text-expense")} disabled={isPending} onSelect={logout}>
              <LogOut className="size-4.5" /> লগআউট
            </DropdownMenu.Item>
          </DropdownMenu.Content>
        </DropdownMenu.Portal>
      </DropdownMenu.Root>

      {open === "settings" ? <SettingsDialog businessName={businessName} onClose={() => setOpen(null)} /> : null}
      {open === "password" ? <PasswordDialog onClose={() => setOpen(null)} /> : null}
    </>
  );
}
