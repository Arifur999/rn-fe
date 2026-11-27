import "server-only";
import { getEnv } from "@/env";
import { getSessionToken } from "@/lib/session";
import type { ApiResponse, PaginationMeta } from "@/types/api.types";

// The only place that talks to the API. Components never import this; they go
// through _action.ts (mutations) or a page's service call (reads).

export class ApiError extends Error {
  status: number;
  fieldErrors?: Record<string, string>;

  constructor(status: number, message: string, fieldErrors?: Record<string, string>) {
    super(message);
    this.status = status;
    this.fieldErrors = fieldErrors;
  }
}

type Params = Record<string, string | number | boolean | undefined | null>;

const buildUrl = (path: string, params?: Params) => {
  const url = new URL(getEnv().API_BASE_URL + path);
  for (const [key, value] of Object.entries(params ?? {})) {
    if (value !== undefined && value !== null && value !== "") url.searchParams.set(key, String(value));
  }
  return url;
};

const send = async <T>(method: string, path: string, body?: unknown, params?: Params): Promise<ApiResponse<T>> => {
  const token = await getSessionToken();
  let res: Response;
  try {
    res = await fetch(buildUrl(path, params), {
      method,
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: body === undefined ? undefined : JSON.stringify(body),
      cache: "no-store",
      signal: AbortSignal.timeout(30_000),
    });
  } catch {
    throw new ApiError(0, "সার্ভারের সাথে যোগাযোগ করা যাচ্ছে না। একটু পরে আবার চেষ্টা করুন।");
  }

  const json = (await res.json().catch(() => null)) as {
    success?: boolean;
    message?: string;
    data?: T;
    meta?: PaginationMeta;
    errorSource?: { path: string; message: string }[];
  } | null;

  if (!res.ok || !json?.success) {
    const fieldErrors = json?.errorSource?.length
      ? Object.fromEntries(json.errorSource.filter((e) => e.path).map((e) => [e.path, e.message]))
      : undefined;
    throw new ApiError(res.status, json?.message || "কিছু একটা সমস্যা হয়েছে", fieldErrors);
  }

  return { success: true, message: json.message ?? "", data: json.data as T, meta: json.meta };
};

export const httpClient = {
  get: <T>(path: string, params?: Params) => send<T>("GET", path, undefined, params),
  post: <T>(path: string, body?: unknown) => send<T>("POST", path, body ?? {}),
  patch: <T>(path: string, body?: unknown) => send<T>("PATCH", path, body ?? {}),
  delete: <T>(path: string) => send<T>("DELETE", path),
};
