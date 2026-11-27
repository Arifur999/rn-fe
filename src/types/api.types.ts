// The envelope every service returns and every _action.ts resolves to.
// Callers narrow on `success` and never see a thrown error.

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPage: number;
  summary?: Record<string, number>;
}

export interface ApiResponse<TData = unknown> {
  success: true;
  message: string;
  data: TData;
  meta?: PaginationMeta;
}

export interface ApiErrorResponse {
  success: false;
  message: string;
  status?: number;
  fieldErrors?: Record<string, string>;
}

export type ApiResult<TData = unknown> = ApiResponse<TData> | ApiErrorResponse;
