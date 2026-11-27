"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import type { z } from "zod";
import { fieldErrorsOf } from "@/zod/common";
import type { ApiResult } from "@/types/api.types";

/**
 * The one form flow every dialog uses: validate in the browser, call the
 * action, toast, refresh the server page, then let the caller close.
 */
export function useFormState<S extends z.ZodType, TData>(
  schema: S,
  initial: z.input<S>,
  action: (values: z.input<S>) => Promise<ApiResult<TData>>,
  onDone?: (data: TData) => void,
) {
  const router = useRouter();
  const [values, setValues] = useState<z.input<S>>(initial);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isPending, startTransition] = useTransition();

  const set = (patch: Partial<z.input<S>>) => {
    setValues((v) => ({ ...(v as object), ...patch }) as z.input<S>);
    // Clear the error of a field as soon as it is edited.
    setErrors((e) => {
      const next = { ...e };
      for (const key of Object.keys(patch)) delete next[key];
      return next;
    });
  };

  const submit = () => {
    const parsed = schema.safeParse(values);
    if (!parsed.success) {
      const fieldErrors = fieldErrorsOf(parsed.error);
      setErrors(fieldErrors);
      toast.error(Object.values(fieldErrors)[0] ?? "তথ্য ঠিক করে দিন");
      return;
    }
    startTransition(async () => {
      let result: ApiResult<TData>;
      try {
        result = await action(values);
      } catch {
        toast.error("সার্ভারের সাথে যোগাযোগ করা যাচ্ছে না");
        return;
      }
      if (!result.success) {
        if (result.fieldErrors) setErrors(result.fieldErrors);
        toast.error(result.message);
        if (result.status === 401) router.refresh();
        return;
      }
      toast.success(result.message);
      router.refresh();
      onDone?.(result.data);
    });
  };

  return { values, set, setValues, errors, submit, isPending };
}

/** For one-click actions (delete, logout): toast + refresh. */
export function useRunAction() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const run = <T,>(action: () => Promise<ApiResult<T>>, onDone?: (data: T) => void) =>
    startTransition(async () => {
      try {
        const result = await action();
        if (!result.success) {
          toast.error(result.message);
          if (result.status === 401) router.refresh();
          return;
        }
        toast.success(result.message);
        router.refresh();
        onDone?.(result.data);
      } catch {
        toast.error("সার্ভারের সাথে যোগাযোগ করা যাচ্ছে না");
      }
    });

  return { run, isPending };
}
