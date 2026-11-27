import { LoaderCircle } from "lucide-react";
import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

const VARIANTS = {
  primary: "bg-primary text-white hover:bg-primary-hover shadow-sm",
  accent: "bg-accent text-ink hover:bg-accent-hover shadow-sm",
  outline: "border border-line bg-surface text-ink hover:bg-surface-2",
  ghost: "text-ink-2 hover:bg-line-2 hover:text-ink",
  danger: "bg-expense text-white hover:bg-red-700 shadow-sm",
  soft: "bg-primary-soft text-primary hover:bg-blue-100",
} as const;

const SIZES = {
  sm: "h-9 px-3 text-sm gap-1.5 rounded-lg",
  md: "h-11 px-4 text-[15px] gap-2 rounded-xl",
  lg: "h-12 px-5 text-base gap-2 rounded-xl",
  icon: "size-10 rounded-xl",
} as const;

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: keyof typeof VARIANTS;
  size?: keyof typeof SIZES;
  pending?: boolean;
};

export const buttonClass = (variant: keyof typeof VARIANTS = "primary", size: keyof typeof SIZES = "md", extra?: string) =>
  cn(
    "inline-flex shrink-0 cursor-pointer items-center justify-center font-semibold whitespace-nowrap transition-colors",
    "focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-60",
    VARIANTS[variant],
    SIZES[size],
    extra,
  );

export function Button({ variant = "primary", size = "md", pending, disabled, className, children, type = "button", ...props }: ButtonProps) {
  return (
    <button type={type} disabled={disabled || pending} className={buttonClass(variant, size, className)} {...props}>
      {pending && <LoaderCircle className="size-4 animate-spin" aria-hidden />}
      {children}
    </button>
  );
}
