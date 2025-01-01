export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface ApiMeta {
  total: number;
  page: number;
  limit: number;
}

export interface ServerResponse {
  success: boolean;
  statusCode: number;
  message: string;
  meta?: ApiMeta;
}

export interface ListResponse<T> {
  success: boolean;
  message: string;
  data: T[];
  meta: ApiMeta;
}
