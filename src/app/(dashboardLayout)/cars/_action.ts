"use server";

import { requireId, runAction, runValidatedAction } from "@/lib/runAction";
import { createCar, deleteCar, updateCar } from "@/services/car.services";
import { carFormZodSchema } from "@/zod/car.validation";

export const createCarAction = async (values: unknown) =>
  runValidatedAction(carFormZodSchema, values, (data) => createCar(data));

export const updateCarAction = async (id: string, values: unknown) =>
  requireId(id) ?? runValidatedAction(carFormZodSchema, values, (data) => updateCar(id, data));

export const deleteCarAction = async (id: string) => requireId(id) ?? runAction(() => deleteCar(id));
