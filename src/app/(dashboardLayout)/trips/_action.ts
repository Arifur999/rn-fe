"use server";

import { requireId, runAction, runValidatedAction } from "@/lib/runAction";
import { collectTripDue, createTrip, deleteTrip, updateTrip } from "@/services/trip.services";
import { collectFormZodSchema, tripFormZodSchema } from "@/zod/trip.validation";

export const createTripAction = async (values: unknown) =>
  runValidatedAction(tripFormZodSchema, values, (data) => createTrip(data));

// Editing a trip leaves its expenses alone (they are edited on the খরচ page).
export const updateTripAction = async (id: string, values: unknown) =>
  requireId(id) ??
  runValidatedAction(tripFormZodSchema, values, (data) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { expenses, ...trip } = data;
    return updateTrip(id, trip);
  });

export const collectTripAction = async (id: string, values: unknown) =>
  requireId(id) ?? runValidatedAction(collectFormZodSchema, values, (data) => collectTripDue(id, data.amount));

export const deleteTripAction = async (id: string) => requireId(id) ?? runAction(() => deleteTrip(id));
