"use client";

import { ChevronLeft, ChevronRight, Search } from "lucide-react";
import { useEffect, useState } from "react";
import { useUrlParams } from "@/hooks/useUrlParams";
import { toBnNumber } from "@/lib/format";
import { cn } from "@/lib/utils";

/** A compact native select bound to one URL param. "" = all. */
export function SelectFilter({
  param,
  value,
  allLabel,
  options,
  label,
}: {
  param: string;
  value: string;
  allLabel: string;
  options: { value: string; label: string }[];
  label: string;
}) {
  const { setParams } = useUrlParams();
  return (
    <select
      aria-label={label}
      value={value}
      onChange={(e) => setParams({ [param]: e.target.value })}
      className={cn(
        "h-10 max-w-full min-w-0 cursor-pointer rounded-xl border bg-surface px-3 text-sm",
        value ? "border-primary text-primary" : "border-line text-ink-2",
      )}
    >
      <option value="">{allLabel}</option>
      {options.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  );
}

/** Search box that writes ?q= after the user pauses typing. */
export function SearchFilter({ value, placeholder }: { value: string; placeholder: string }) {
  const { setParams } = useUrlParams();
  const [text, setText] = useState(value);

  useEffect(() => {
    if (text === value) return;
    const timer = setTimeout(() => setParams({ q: text.trim() }), 450);
    return () => clearTimeout(timer);
  }, [text, value, setParams]);

  return (
    <div className="relative min-w-0 flex-1 sm:max-w-xs">
      <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-ink-3" aria-hidden />
      <input
        type="search"
        aria-label={placeholder}
        placeholder={placeholder}
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="h-10 w-full rounded-xl border border-line bg-surface pr-3 pl-9 text-sm focus:border-primary focus:outline-none"
      />
    </div>
  );
}

export function Pagination({ page, totalPage }: { page: number; totalPage: number }) {
  const { setParams, isPending } = useUrlParams();
  if (totalPage <= 1) return null;
  const go = (p: number) => setParams({ page: p > 1 ? String(p) : null });
  const btn = "grid size-10 cursor-pointer place-items-center rounded-xl border border-line bg-surface disabled:cursor-not-allowed disabled:opacity-40";
  return (
    <nav className="flex items-center justify-center gap-3 pt-2" aria-label="পাতা">
      <button type="button" className={btn} disabled={page <= 1 || isPending} onClick={() => go(page - 1)} aria-label="আগের পাতা">
        <ChevronLeft className="size-5" />
      </button>
      <span className="text-sm text-ink-2">
        পাতা {toBnNumber(page)} / {toBnNumber(totalPage)}
      </span>
      <button type="button" className={btn} disabled={page >= totalPage || isPending} onClick={() => go(page + 1)} aria-label="পরের পাতা">
        <ChevronRight className="size-5" />
      </button>
    </nav>
  );
}
