import "server-only";
import { httpClient } from "@/lib/httpClient";
import type { IAdmin, ILoginResult } from "@/types";

// server-only (not "use server"): login returns the raw session token, which
// must never be callable from the browser.

export const login = (payload: { email: string; password: string }) =>
  httpClient.post<ILoginResult>("/auth/login", payload);

export const logout = () => httpClient.post<null>("/auth/logout");

export const getMe = () => httpClient.get<IAdmin>("/auth/me");

export const changePassword = (payload: { current_password: string; new_password: string }) =>
  httpClient.post<null>("/auth/change-password", payload);

export const updateSettings = (payload: { business_name: string }) =>
  httpClient.patch<IAdmin>("/auth/settings", payload);
