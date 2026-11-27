import { CREDIT } from "@/constants/bn";
import { cn } from "@/lib/utils";

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden>
      <rect x="2" y="2" width="20" height="20" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.6" fill="currentColor" />
    </svg>
  );
}

/** "Built by Arif" with the Instagram link, at the bottom of every page. */
export function Credit({ className }: { className?: string }) {
  return (
    <footer className={cn("flex items-center justify-center gap-1.5 py-4 text-sm text-ink-3", className)}>
      <span>Built by</span>
      <a
        href={CREDIT.url}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1 font-semibold text-ink-2 underline-offset-4 hover:text-primary hover:underline"
      >
        <InstagramIcon className="size-4" />
        {CREDIT.name}
      </a>
    </footer>
  );
}
