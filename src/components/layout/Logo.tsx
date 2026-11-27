import { CarFront } from "lucide-react";
import { cn } from "@/lib/utils";

export function Logo({ name, dark, className }: { name: string; dark?: boolean; className?: string }) {
  return (
    <div className={cn("flex min-w-0 items-center gap-2.5", className)}>
      <div className="grid size-10 shrink-0 place-items-center rounded-xl bg-accent text-sidebar shadow-sm">
        <CarFront className="size-5.5" strokeWidth={2.4} />
      </div>
      <span className={cn("truncate text-lg font-bold", dark ? "text-white" : "text-ink")}>{name}</span>
    </div>
  );
}
