"use server";

import { requireId, runAction, runValidatedAction } from "@/lib/runAction";
import { createDriver, deleteDriver, updateDriver } from "@/services/driver.services";
import { driverFormZodSchema } from "@/zod/driver.validation";

export const createDriverAction = async (values: unknown) =>
  runValidatedAction(driverFormZodSchema, values, (data) => createDriver(data));

export const updateDriverAction = async (id: string, values: unknown) =>
  requireId(id) ?? runValidatedAction(driverFormZodSchema, values, (data) => updateDriver(id, data));

export const deleteDriverAction = async (id: string) => requireId(id) ?? runAction(() => deleteDriver(id));
