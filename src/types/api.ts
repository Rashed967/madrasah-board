import { Madrasah } from './madrasah';
import { ApiMeta } from './common';

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  meta?: ApiMeta;
}

export interface MadrasahApiResponse extends ApiResponse<Madrasah> {}

export interface MadrasahListApiResponse extends ApiResponse<Madrasah[]> {
  meta: ApiMeta;
}
