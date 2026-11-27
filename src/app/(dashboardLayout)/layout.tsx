import { Suspense } from "react";
import { Credit } from "@/components/layout/Credit";
import { Logo } from "@/components/layout/Logo";
import { BottomNav, NewTripFab, SidebarNav } from "@/components/layout/Nav";
import { AccountMenu } from "@/components/modules/Settings/AccountMenu";
import { loadPage } from "@/lib/loadPage";
import { getMe } from "@/services/auth.services";

// Desktop: dark sidebar on the left. Phone: top bar + bottom tab bar.
// The floating "+ নতুন ট্রিপ" button is on every screen.
export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { data: admin } = await loadPage(() => getMe());

  return (
    <div className="min-h-dvh lg:pl-64">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col bg-sidebar px-4 py-5 lg:flex">
        <Logo name={admin.business_name} dark className="px-1.5" />
        <div className="mt-8 flex-1">
          <SidebarNav isSuperAdmin={admin.role === "super_admin"} />
        </div>
        <div className="border-t border-white/10 pt-3">
          <AccountMenu admin={admin} dark />
        </div>
      </aside>

      <header className="sticky top-0 z-30 flex items-center justify-between gap-3 border-b border-line/70 bg-surface/90 px-4 pt-[env(safe-area-inset-top)] backdrop-blur lg:hidden">
        <div className="flex h-15 min-w-0 items-center">
          <Logo name={admin.business_name} />
        </div>
        <AccountMenu admin={admin} />
      </header>

      <main className="mx-auto w-full max-w-6xl px-4 pt-5 pb-4 sm:px-6 lg:px-8 lg:pt-8">{children}</main>
      <Credit className="pb-[calc(6.5rem+env(safe-area-inset-bottom))] lg:pb-6" />

      <Suspense>
        <NewTripFab />
      </Suspense>
      <BottomNav />
    </div>
  );
}
