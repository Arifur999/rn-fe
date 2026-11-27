import "server-only";
import { ApiError } from "@/lib/httpClient";
import { clearSessionToken } from "@/lib/session";
import type { ApiErrorResponse, ApiResponse, ApiResult } from "@/types/api.types";
import type { z } from "zod";

// What every _action.ts does, written once: re-validate on the server, call
// the service, turn any throw into { success: false, message }. Actions never throw.

export const toValidationError = (error: z.ZodError): ApiErrorResponse => ({
  success: false,
  message: error.issues[0]?.message ?? "তথ্য সঠিক নয়",
  fieldErrors: Object.fromEntries(error.issues.map((issue) => [issue.path.join("."), issue.message])),
});

export const runAction = async <T>(run: () => Promise<ApiResponse<T>>): Promise<ApiResult<T>> => {
  try {
    return await run();
  } catch (error) {
    if (error instanceof ApiError) {
      // A dead session: drop the cookie so the next navigation lands on login.
      if (error.status === 401) await clearSessionToken();
      return { success: false, status: error.status, message: error.message, fieldErrors: error.fieldErrors };
    }
    return { success: false, message: "কিছু একটা সমস্যা হয়েছে। আবার চেষ্টা করুন।" };
  }
};

export const runValidatedAction = async <S extends z.ZodType, T>(
  schema: S,
  values: unknown,
  run: (data: z.output<S>) => Promise<ApiResponse<T>>,
): Promise<ApiResult<T>> => {
  const parsed = schema.safeParse(values);
  return parsed.success ? runAction(() => run(parsed.data)) : toValidationError(parsed.error);
};

/** An empty id would otherwise turn DELETE /cars/:id into DELETE /cars/. */
export const requireId = (id: string | undefined): ApiErrorResponse | null =>
  id && /^[0-9a-f-]{36}$/i.test(id) ? null : { success: false, message: "ভুল আইডি" };
