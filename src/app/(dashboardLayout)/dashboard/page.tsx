import type { Metadata } from "next";
import { DashboardView } from "@/components/modules/Dashboard/DashboardView";
import { resolvePeriod } from "@/lib/dates";
import { loadPage } from "@/lib/loadPage";
import { param, type SearchParams } from "@/lib/pageParams";
import { getDashboard } from "@/services/dashboard.services";

export const metadata: Metadata = { title: "ড্যাশবোর্ড" };

export default async function DashboardPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const sp = await searchParams;
  const period = resolvePeriod({ period: param(sp, "period"), from: param(sp, "from"), to: param(sp, "to") }, "today");
  const { data } = await loadPage(() => getDashboard(period));
  return <DashboardView data={data} period={period} />;
}
