import type { ReactNode } from "react";

export function PageHeader({ title, subtitle, action }: { title: string; subtitle?: ReactNode; action?: ReactNode }) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-3">
      <div className="min-w-0">
        <h1 className="text-2xl leading-tight font-bold sm:text-[28px]">{title}</h1>
        {subtitle ? <p className="mt-0.5 text-sm text-ink-2">{subtitle}</p> : null}
      </div>
      {action ? <div className="flex shrink-0 gap-2">{action}</div> : null}
    </div>
  );
}
