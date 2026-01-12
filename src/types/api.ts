// API Response Types

export interface ApiMeta {
  current_page: number;
  per_page: number;
  total_count: number;
  total_pages: number;
}

export interface ApiSuccessResponse<T> {
  data: T;
  meta?: ApiMeta;
}

export interface ApiErrorResponse {
  errors: string[];
}

export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;

// Helper to check if response is an error
export function isApiError(response: ApiResponse<unknown>): response is ApiErrorResponse {
  return 'errors' in response;
}
