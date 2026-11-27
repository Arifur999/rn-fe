"use server";

import { requireId, runAction, runValidatedAction } from "@/lib/runAction";
import { createExpense, deleteExpense, updateExpense } from "@/services/expense.services";
import { expenseFormZodSchema } from "@/zod/expense.validation";

export const createExpenseAction = async (values: unknown) =>
  runValidatedAction(expenseFormZodSchema, values, (data) => createExpense(data));

export const updateExpenseAction = async (id: string, values: unknown) =>
  requireId(id) ?? runValidatedAction(expenseFormZodSchema, values, (data) => updateExpense(id, data));

export const deleteExpenseAction = async (id: string) => requireId(id) ?? runAction(() => deleteExpense(id));
