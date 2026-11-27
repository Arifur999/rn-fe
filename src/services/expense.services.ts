import "server-only";
import { httpClient } from "@/lib/httpClient";
import type { IExpense } from "@/types";
import type { ExpensePayload } from "@/zod/expense.validation";

export interface ExpenseListParams {
  from?: string;
  to?: string;
  category?: string;
  car_id?: string;
  driver_id?: string;
  search?: string;
  page?: number;
  limit?: number;
}

export const getExpenses = (params: ExpenseListParams) => httpClient.get<IExpense[]>("/expenses", { ...params });

export const createExpense = (payload: ExpensePayload) => httpClient.post<IExpense>("/expenses", payload);

export const updateExpense = (id: string, payload: ExpensePayload) =>
  httpClient.patch<IExpense>(`/expenses/${id}`, payload);

export const deleteExpense = (id: string) => httpClient.delete<null>(`/expenses/${id}`);
