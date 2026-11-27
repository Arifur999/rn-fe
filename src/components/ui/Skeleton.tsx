import { cn } from "@/lib/utils";

export function Skeleton({ className }: { className?: string }) {
  return <div className={cn("animate-pulse rounded-xl bg-line-2", className)} aria-hidden />;
}

/** The loading.tsx body every list page shares. */
export function PageSkeleton({ cards = 4 }: { cards?: number }) {
  return (
    <div className="flex flex-col gap-4" aria-busy="true" aria-label="লোড হচ্ছে">
      <Skeleton className="h-9 w-48" />
      <div className="flex gap-2">
        <Skeleton className="h-9 w-20 rounded-full" />
        <Skeleton className="h-9 w-24 rounded-full" />
        <Skeleton className="h-9 w-20 rounded-full" />
      </div>
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {Array.from({ length: 4 }, (_, i) => (
          <Skeleton key={i} className="h-20" />
        ))}
      </div>
      <div className="grid gap-3 md:grid-cols-2">
        {Array.from({ length: cards }, (_, i) => (
          <Skeleton key={i} className="h-36" />
        ))}
      </div>
    </div>
  );
}
