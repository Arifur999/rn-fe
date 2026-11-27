import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("rounded-2xl border border-line/70 bg-surface shadow-card", className)} {...props} />;
}

/** A titled dashboard/detail section. */
export function Section({
  title,
  icon,
  action,
  className,
  children,
}: {
  title: string;
  icon?: ReactNode;
  action?: ReactNode;
  className?: string;
  children: ReactNode;
}) {
  return (
    <Card className={cn("flex min-w-0 flex-col", className)}>
      <div className="flex items-center justify-between gap-3 border-b border-line-2 px-4 py-3 sm:px-5">
        <h2 className="flex items-center gap-2 text-base font-bold">
          {icon}
          {title}
        </h2>
        {action}
      </div>
      <div className="min-w-0 flex-1 p-4 sm:p-5">{children}</div>
    </Card>
  );
}

const BADGE_TONES = {
  green: "bg-income-soft text-income",
  red: "bg-expense-soft text-expense",
  amber: "bg-due-soft text-due",
  blue: "bg-primary-soft text-primary",
  gray: "bg-line-2 text-ink-2",
  purple: "bg-profit-soft text-profit",
} as const;

export type BadgeTone = keyof typeof BADGE_TONES;

export function Badge({ tone = "gray", className, children }: { tone?: BadgeTone; className?: string; children: ReactNode }) {
  return (
    <span className={cn("inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold whitespace-nowrap", BADGE_TONES[tone], className)}>
      {children}
    </span>
  );
}

export function EmptyState({ icon, title, text, action }: { icon: ReactNode; title: string; text?: string; action?: ReactNode }) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 px-4 py-12 text-center">
      <div className="mb-1 grid size-14 place-items-center rounded-2xl bg-primary-soft text-primary">{icon}</div>
      <p className="text-base font-bold">{title}</p>
      {text ? <p className="max-w-sm text-sm text-ink-2">{text}</p> : null}
      {action ? <div className="mt-2">{action}</div> : null}
    </div>
  );
}

/** Registration number shown like a number plate. */
export function NumberPlate({ number, className }: { number: string; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md border-2 border-ink/80 bg-white px-2 py-0.5 text-[13px] font-bold tracking-wide text-ink",
        className,
      )}
    >
      {number}
    </span>
  );
}
