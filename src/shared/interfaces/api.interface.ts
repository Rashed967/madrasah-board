export interface ApiResponse<T = any> {
  success: boolean;
  statusCode: number;
  message: string;
  data: T;
  meta?: {
    total: number;
    page: number;
    limit: number;
  };
}

export interface ApiError {
  message: string;
  status: number;
}
