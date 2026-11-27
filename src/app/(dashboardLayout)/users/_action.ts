"use server";

import { requireId, runAction, runValidatedAction } from "@/lib/runAction";
import { createUser, deleteUser, resetUserPassword, updateUser } from "@/services/user.services";
import { resetPasswordFormZodSchema, userFormZodSchema } from "@/zod/user.validation";

export const createUserAction = async (values: unknown) =>
  runValidatedAction(userFormZodSchema, values, (data) => createUser(data));

export const setUserActiveAction = async (id: string, isActive: boolean) =>
  requireId(id) ?? runAction(() => updateUser(id, { is_active: isActive === true }));

export const resetUserPasswordAction = async (id: string, values: unknown) =>
  requireId(id) ?? runValidatedAction(resetPasswordFormZodSchema, values, (data) => resetUserPassword(id, data.password));

export const deleteUserAction = async (id: string) => requireId(id) ?? runAction(() => deleteUser(id));
