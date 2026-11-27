import "server-only";
import { httpClient } from "@/lib/httpClient";
import type { ICar, ICarSummary } from "@/types";
import type { CarPayload } from "@/zod/car.validation";

export const getCars = (params: { search?: string; status?: string } = {}) => httpClient.get<ICar[]>("/cars", params);

export const getCarSummary = (id: string, range: { from: string; to: string }) =>
  httpClient.get<ICarSummary>(`/cars/${id}/summary`, range);

export const createCar = (payload: CarPayload) => httpClient.post<ICar>("/cars", payload);

export const updateCar = (id: string, payload: Partial<CarPayload>) => httpClient.patch<ICar>(`/cars/${id}`, payload);

export const deleteCar = (id: string) => httpClient.delete<null>(`/cars/${id}`);
