import "server-only";
import { httpClient } from "@/lib/httpClient";
import type { IUser, Role } from "@/types";

// Super admin only; the API refuses everyone else.

export const getUsers = () => httpClient.get<IUser[]>("/users");

export const createUser = (payload: { name: string; email: string; password: string; role: Role }) =>
  httpClient.post<IUser>("/users", payload);

export const updateUser = (id: string, payload: { name?: string; is_active?: boolean }) =>
  httpClient.patch<IUser>(`/users/${id}`, payload);

export const resetUserPassword = (id: string, password: string) =>
  httpClient.post<null>(`/users/${id}/reset-password`, { password });

export const deleteUser = (id: string) => httpClient.delete<null>(`/users/${id}`);
