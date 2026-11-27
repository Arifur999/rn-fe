"use client";

import { X } from "lucide-react";
import { Dialog } from "radix-ui";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type ModalProps = {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  footer?: ReactNode;
  children: ReactNode;
  size?: "sm" | "md" | "lg";
};

const WIDTH = { sm: "sm:max-w-md", md: "sm:max-w-xl", lg: "sm:max-w-2xl" };

/**
 * Bottom sheet on a phone (thumb-reachable, full width), centered card on a
 * bigger screen. Body scrolls; header and footer stay put.
 */
export function Modal({ open, onClose, title, description, footer, children, size = "md" }: ModalProps) {
  return (
    <Dialog.Root open={open} onOpenChange={(next) => !next && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="animate-fade-in fixed inset-0 z-50 bg-ink/45 backdrop-blur-[2px]" />
        <Dialog.Content
          className={cn(
            "fixed z-50 flex flex-col bg-surface text-ink shadow-pop outline-none",
            // phone: sheet from the bottom
            "animate-sheet-up inset-x-0 bottom-0 max-h-[92dvh] rounded-t-3xl",
            // tablet/desktop: centered card
            "sm:animate-pop-in sm:inset-x-auto sm:bottom-auto sm:top-1/2 sm:left-1/2 sm:max-h-[88dvh] sm:w-[calc(100%-2rem)] sm:-translate-x-1/2 sm:-translate-y-1/2 sm:rounded-3xl",
            WIDTH[size],
          )}
        >
          <div className="mx-auto mt-2.5 h-1.5 w-12 rounded-full bg-line sm:hidden" aria-hidden />
          <div className="flex items-start justify-between gap-4 border-b border-line-2 px-5 pt-3 pb-3.5 sm:px-6 sm:pt-5">
            <div className="min-w-0">
              <Dialog.Title className="text-lg font-bold">{title}</Dialog.Title>
              {description ? (
                <Dialog.Description className="text-sm text-ink-2">{description}</Dialog.Description>
              ) : (
                <Dialog.Description className="sr-only">{title}</Dialog.Description>
              )}
            </div>
            <Dialog.Close
              className="-mr-2 grid size-10 shrink-0 cursor-pointer place-items-center rounded-full text-ink-2 hover:bg-line-2"
              aria-label="বন্ধ করুন"
            >
              <X className="size-5" />
            </Dialog.Close>
          </div>
          <div className="min-h-0 flex-1 overflow-y-auto px-5 py-4 sm:px-6">{children}</div>
          {footer ? (
            <div className="flex gap-3 border-t border-line-2 bg-surface-2 px-5 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] sm:rounded-b-3xl sm:px-6 sm:pb-4">
              {footer}
            </div>
          ) : null}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
