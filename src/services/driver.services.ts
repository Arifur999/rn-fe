import "server-only";
import { httpClient } from "@/lib/httpClient";
import type { IDriver, IDriverSummary } from "@/types";
import type { DriverPayload } from "@/zod/driver.validation";

export const getDrivers = (params: { search?: string; status?: string } = {}) =>
  httpClient.get<IDriver[]>("/drivers", params);

export const getDriverSummary = (id: string, range: { from: string; to: string }) =>
  httpClient.get<IDriverSummary>(`/drivers/${id}/summary`, range);

export const createDriver = (payload: DriverPayload) => httpClient.post<IDriver>("/drivers", payload);

export const updateDriver = (id: string, payload: Partial<DriverPayload>) =>
  httpClient.patch<IDriver>(`/drivers/${id}`, payload);

export const deleteDriver = (id: string) => httpClient.delete<null>(`/drivers/${id}`);
