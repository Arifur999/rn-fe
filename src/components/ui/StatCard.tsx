import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

const TONES = {
  blue: { icon: "bg-primary-soft text-primary", value: "text-ink" },
  green: { icon: "bg-income-soft text-income", value: "text-income" },
  red: { icon: "bg-expense-soft text-expense", value: "text-expense" },
  amber: { icon: "bg-due-soft text-due", value: "text-due" },
  purple: { icon: "bg-profit-soft text-profit", value: "text-profit" },
} as const;

export function StatCard({
  label,
  value,
  icon,
  tone = "blue",
  hint,
  className,
}: {
  label: string;
  value: string;
  icon: ReactNode;
  tone?: keyof typeof TONES;
  hint?: string;
  className?: string;
}) {
  return (
    <div className={cn("flex min-w-0 items-center gap-3 rounded-2xl border border-line/70 bg-surface p-3.5 shadow-card sm:p-4", className)}>
      <div className={cn("grid size-11 shrink-0 place-items-center rounded-xl", TONES[tone].icon)}>{icon}</div>
      <div className="min-w-0">
        <p className="truncate text-[13px] font-medium text-ink-2">{label}</p>
        <p className={cn("truncate text-lg leading-tight font-bold sm:text-xl", TONES[tone].value)}>{value}</p>
        {hint ? <p className="truncate text-xs text-ink-3">{hint}</p> : null}
      </div>
    </div>
  );
}
