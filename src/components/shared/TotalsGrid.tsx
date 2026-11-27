import { HandCoins, Route, TrendingDown, TrendingUp, Wallet } from "lucide-react";
import { StatCard } from "@/components/ui/StatCard";
import { formatMoney, toBnNumber } from "@/lib/format";
import type { ITotals } from "@/types";

/** ট্রিপ · আয় · খরচ · লাভ · বাকি — the five numbers every summary shows. */
export function TotalsGrid({ totals }: { totals: ITotals }) {
  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-5">
      <StatCard label="মোট ট্রিপ" value={`${toBnNumber(totals.trips)}টি`} icon={<Route className="size-5" />} tone="blue" />
      <StatCard label="আয় (পেয়েছি)" value={formatMoney(totals.income)} icon={<TrendingUp className="size-5" />} tone="green" />
      <StatCard label="খরচ" value={formatMoney(totals.expense)} icon={<TrendingDown className="size-5" />} tone="red" />
      <StatCard
        label={totals.profit < 0 ? "লোকসান" : "লাভ"}
        value={formatMoney(Math.abs(totals.profit))}
        icon={<Wallet className="size-5" />}
        tone={totals.profit < 0 ? "red" : "purple"}
      />
      <StatCard
        label="বাকি (পাওনা)"
        value={formatMoney(totals.due)}
        icon={<HandCoins className="size-5" />}
        tone="amber"
        className="col-span-2 md:col-span-1"
      />
    </div>
  );
}
