import { ChevronDown } from "lucide-react";
import type { InputHTMLAttributes, ReactNode, SelectHTMLAttributes, TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

const control = (invalid?: boolean) =>
  cn(
    "w-full rounded-xl border bg-surface px-3.5 text-[15px] text-ink placeholder:text-ink-3 transition-colors",
    "focus:border-primary focus:ring-2 focus:ring-primary/15 focus:outline-none disabled:bg-surface-2",
    invalid ? "border-expense" : "border-line",
  );

type FieldProps = {
  label: string;
  htmlFor: string;
  required?: boolean;
  error?: string;
  hint?: ReactNode;
  className?: string;
  children: ReactNode;
};

/** Label, control, then the error (or a hint) underneath. */
export function Field({ label, htmlFor, required, error, hint, className, children }: FieldProps) {
  return (
    <div className={cn("flex min-w-0 flex-col gap-1.5", className)}>
      <label htmlFor={htmlFor} className="text-sm font-semibold text-ink">
        {label} {required ? <span className="text-expense">*</span> : null}
      </label>
      {children}
      {error ? (
        <span role="alert" className="text-[13px] text-expense">
          {error}
        </span>
      ) : hint ? (
        <span className="text-[13px] text-ink-3">{hint}</span>
      ) : null}
    </div>
  );
}

export function Input({ invalid, className, ...props }: InputHTMLAttributes<HTMLInputElement> & { invalid?: boolean }) {
  return <input aria-invalid={invalid || undefined} className={cn(control(invalid), "h-11", className)} {...props} />;
}

/** Money/number input: numeric keyboard on phones, Bangla digits allowed. */
export function MoneyInput({ invalid, className, ...props }: InputHTMLAttributes<HTMLInputElement> & { invalid?: boolean }) {
  return (
    <div className="relative">
      <span className="pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2 text-ink-3">৳</span>
      <input
        inputMode="decimal"
        autoComplete="off"
        aria-invalid={invalid || undefined}
        className={cn(control(invalid), "h-11 pl-8", className)}
        {...props}
      />
    </div>
  );
}

export function Textarea({ invalid, className, ...props }: TextareaHTMLAttributes<HTMLTextAreaElement> & { invalid?: boolean }) {
  return <textarea rows={2} aria-invalid={invalid || undefined} className={cn(control(invalid), "py-2.5", className)} {...props} />;
}

/** Native select: on a phone this opens the system picker, which is the easiest to use. */
export function Select({ invalid, className, children, ...props }: SelectHTMLAttributes<HTMLSelectElement> & { invalid?: boolean }) {
  return (
    <div className="relative">
      <select aria-invalid={invalid || undefined} className={cn(control(invalid), "h-11 cursor-pointer appearance-none pr-9", className)} {...props}>
        {children}
      </select>
      <ChevronDown className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-ink-3" aria-hidden />
    </div>
  );
}

type ChipOption<T extends string> = { value: T; label: string };

/** A small single-choice row (status pickers). */
export function ChoiceChips<T extends string>({
  name,
  value,
  options,
  onChange,
}: {
  name: string;
  value: T;
  options: ChipOption<T>[];
  onChange: (value: T) => void;
}) {
  return (
    <div role="radiogroup" aria-label={name} className="flex flex-wrap gap-2">
      {options.map((option) => {
        const active = option.value === value;
        return (
          <button
            key={option.value}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => onChange(option.value)}
            className={cn(
              "h-9 cursor-pointer rounded-full border px-4 text-sm font-medium transition-colors",
              active ? "border-primary bg-primary text-white" : "border-line bg-surface text-ink-2 hover:border-primary/40",
            )}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
