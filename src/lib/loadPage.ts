import "server-only";
import { notFound, redirect } from "next/navigation";
import { ApiError } from "@/lib/httpClient";
import { SESSION_EXPIRED_REASON } from "@/lib/session";
import type { ApiResponse } from "@/types/api.types";

/**
 * For Server Component reads. A dead session goes to the login page (proxy
 * clears the cookie there; a Server Component cannot), 404 shows not-found,
 * anything else reaches the route's error.tsx.
 */
export const loadPage = async <T>(load: () => Promise<ApiResponse<T>>): Promise<ApiResponse<T>> => {
  try {
    return await load();
  } catch (error) {
    if (error instanceof ApiError && error.status === 401) redirect(`/login?reason=${SESSION_EXPIRED_REASON}`);
    if (error instanceof ApiError && (error.status === 404 || error.status === 400)) notFound();
    throw error;
  }
};
