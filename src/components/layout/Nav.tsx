"use client";

import { CarFront, LayoutDashboard, Plus, Route, ShieldCheck, Users, Wallet } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export const NAV_ITEMS = [
  { href: "/dashboard", label: "ড্যাশবোর্ড", short: "হোম", icon: LayoutDashboard },
  { href: "/trips", label: "ট্রিপ", short: "ট্রিপ", icon: Route },
  { href: "/expenses", label: "খরচ", short: "খরচ", icon: Wallet },
  { href: "/cars", label: "গাড়ি", short: "গাড়ি", icon: CarFront },
  { href: "/drivers", label: "ড্রাইভার", short: "ড্রাইভার", icon: Users },
] as const;

const isActive = (pathname: string, href: string) => pathname === href || pathname.startsWith(`${href}/`);

const USERS_ITEM = { href: "/users", label: "ইউজার", short: "ইউজার", icon: ShieldCheck };

export function SidebarNav({ isSuperAdmin }: { isSuperAdmin: boolean }) {
  const pathname = usePathname();
  const items = isSuperAdmin ? [...NAV_ITEMS, USERS_ITEM] : NAV_ITEMS;
  return (
    <nav className="flex flex-col gap-1" aria-label="মেনু">
      {items.map(({ href, label, icon: Icon }) => {
        const active = isActive(pathname, href);
        return (
          <Link
            key={href}
            href={href}
            aria-current={active ? "page" : undefined}
            className={cn(
              "flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-[15px] font-medium transition-colors",
              active ? "bg-white/12 text-white" : "text-white/65 hover:bg-white/6 hover:text-white",
            )}
          >
            <Icon className={cn("size-5", active && "text-accent")} />
            {label}
          </Link>
        );
      })}
    </nav>
  );
}

export function BottomNav() {
  const pathname = usePathname();
  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-surface/95 pb-[env(safe-area-inset-bottom)] backdrop-blur lg:hidden"
      aria-label="মেনু"
    >
      <div className="mx-auto grid max-w-lg grid-cols-5">
        {NAV_ITEMS.map(({ href, short, icon: Icon }) => {
          const active = isActive(pathname, href);
          return (
            <Link
              key={href}
              href={href}
              aria-current={active ? "page" : undefined}
              className={cn("flex flex-col items-center gap-0.5 pt-2 pb-1.5 text-[11px] font-semibold", active ? "text-primary" : "text-ink-3")}
            >
              <span className={cn("grid h-7 w-12 place-items-center rounded-full transition-colors", active && "bg-primary-soft")}>
                <Icon className="size-5" />
              </span>
              {short}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

/** The always-there "+ নতুন ট্রিপ" button. Opens the trip form on the trips page. */
export function NewTripFab() {
  const pathname = usePathname();
  return (
    <Link
      href="/trips?new=1"
      scroll={false}
      replace={pathname === "/trips"}
      className="fixed right-4 bottom-[calc(5rem+env(safe-area-inset-bottom))] z-40 inline-flex h-14 items-center gap-2 rounded-full bg-accent pr-5 pl-4 text-base font-bold text-ink shadow-fab transition-transform hover:bg-accent-hover active:scale-95 lg:right-8 lg:bottom-8"
    >
      <Plus className="size-6" strokeWidth={2.6} />
      নতুন ট্রিপ
    </Link>
  );
}
