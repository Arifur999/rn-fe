"use client";

import { EllipsisVertical } from "lucide-react";
import { DropdownMenu } from "radix-ui";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export type RowMenuItem = { label: string; icon: ReactNode; onSelect: () => void; danger?: boolean };

/** The ⋮ menu on a card (বদলান / মুছুন ...). */
export function RowMenu({ items, label = "আরও অপশন" }: { items: RowMenuItem[]; label?: string }) {
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger
        className="-mr-1.5 grid size-9 shrink-0 cursor-pointer place-items-center rounded-full text-ink-3 outline-none hover:bg-line-2 hover:text-ink focus-visible:ring-2 focus-visible:ring-primary/40"
        aria-label={label}
      >
        <EllipsisVertical className="size-5" />
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content align="end" sideOffset={4} className="animate-fade-in z-50 min-w-44 rounded-xl border border-line bg-surface p-1 shadow-pop">
          {items.map((item) => (
            <DropdownMenu.Item
              key={item.label}
              onSelect={item.onSelect}
              className={cn(
                "flex cursor-pointer items-center gap-2.5 rounded-lg px-3 py-2.5 text-[15px] outline-none data-[highlighted]:bg-line-2",
                item.danger && "text-expense",
              )}
            >
              {item.icon}
              {item.label}
            </DropdownMenu.Item>
          ))}
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}
