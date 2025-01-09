import { ApiMeta } from './common';

export interface ApiSuccessResponse<T> {
  success: true;
  message: string;
  data: T;
  meta?: ApiMeta;
}

export interface ApiErrorResponse {
  success: false;
  message: string;
  data: null;
  meta?: ApiMeta;
}

export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;

export interface ApiListSuccessResponse<T> {
  success: true;
  message: string;
  data: T[];
  meta: ApiMeta;
}

export type ApiListResponse<T> = ApiListSuccessResponse<T> | ApiErrorResponse;
