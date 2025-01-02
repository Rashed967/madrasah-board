export interface ApiMeta {
  total: number;
  page: number;
  limit: number;
}

export interface BaseApiResponse {
  success: boolean;
  message: string;
}

export interface ApiResponse<T> extends BaseApiResponse {
  data: T;
  meta?: ApiMeta;
}

export interface ListApiResponse<T> extends BaseApiResponse {
  data: T[];
  meta: ApiMeta;
}
