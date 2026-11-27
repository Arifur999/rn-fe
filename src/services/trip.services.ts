import "server-only";
import { httpClient } from "@/lib/httpClient";
import type { ITrip } from "@/types";
import type { TripPayload } from "@/zod/trip.validation";

export interface TripListParams {
  from?: string;
  to?: string;
  car_id?: string;
  driver_id?: string;
  status?: string;
  due_only?: boolean;
  search?: string;
  page?: number;
  limit?: number;
}

export const getTrips = (params: TripListParams) => httpClient.get<ITrip[]>("/trips", { ...params });

export const createTrip = (payload: TripPayload) => httpClient.post<ITrip>("/trips", payload);

export const updateTrip = (id: string, payload: Omit<TripPayload, "expenses">) =>
  httpClient.patch<ITrip>(`/trips/${id}`, payload);

export const collectTripDue = (id: string, amount: number) => httpClient.post<ITrip>(`/trips/${id}/collect`, { amount });

export const deleteTrip = (id: string) => httpClient.delete<null>(`/trips/${id}`);
