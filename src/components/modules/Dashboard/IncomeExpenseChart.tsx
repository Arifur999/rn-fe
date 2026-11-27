import { formatMoney, formatShortDate, toBnNumber } from "@/lib/format";
import type { IDashboard } from "@/types";

/**
 * 30 days of income (green) against expense (red), one pair of bars per day.
 * Plain CSS bars: no chart library to download on a phone.
 */
export function IncomeExpenseChart({ chart }: { chart: IDashboard["chart"] }) {
  const max = Math.max(1, ...chart.map((d) => Math.max(d.income, d.expense)));
  const totalIncome = chart.reduce((s, d) => s + d.income, 0);
  const totalExpense = chart.reduce((s, d) => s + d.expense, 0);

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap gap-x-5 gap-y-1 text-sm">
        <span className="inline-flex items-center gap-1.5">
          <span className="size-3 rounded-sm bg-income" /> আয় <b>{formatMoney(totalIncome)}</b>
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="size-3 rounded-sm bg-expense" /> খরচ <b>{formatMoney(totalExpense)}</b>
        </span>
      </div>
      <div className="-mx-1 overflow-x-auto px-1 pb-1">
        <div className="flex h-44 min-w-[34rem] items-end gap-1">
          {chart.map((d, i) => (
            <div key={d.date} className="group relative flex h-full flex-1 flex-col justify-end">
              <div className="flex h-full items-end justify-center gap-px">
                <div
                  className="w-1/2 max-w-2.5 rounded-t-sm bg-income/85 transition-colors group-hover:bg-income"
                  style={{ height: `${(d.income / max) * 100}%`, minHeight: d.income ? 2 : 0 }}
                />
                <div
                  className="w-1/2 max-w-2.5 rounded-t-sm bg-expense/75 transition-colors group-hover:bg-expense"
                  style={{ height: `${(d.expense / max) * 100}%`, minHeight: d.expense ? 2 : 0 }}
                />
              </div>
              <div className="pointer-events-none absolute bottom-full left-1/2 z-10 mb-1 hidden -translate-x-1/2 rounded-lg bg-ink px-2 py-1 text-[11px] whitespace-nowrap text-white group-hover:block">
                {formatShortDate(d.date)} · আয় {formatMoney(d.income)} · খরচ {formatMoney(d.expense)}
              </div>
              <span className="mt-1 h-4 text-center text-[10px] text-ink-3">{i % 5 === 4 || i === chart.length - 1 ? toBnNumber(Number(d.date.slice(8))) : ""}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
