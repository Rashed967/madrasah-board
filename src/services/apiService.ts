import { getAuthHeader } from './authService';

interface ApiResponse<T = any> {
  data?: T;
  error?: string;
  status: number;
  success?: boolean;
  message?: string;
}

const baseUrl = process.env.NEXT_PUBLIC_MAIN_URL;
const apiToken = process.env.NEXT_PUBLIC_API_TOKEN;

const request = async <T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> => {
  try {
    const url = `${baseUrl}${endpoint}`;
    const headers = {
      'Content-Type': 'application/json',
      'x-api-token': apiToken as string,
      ...getAuthHeader(),
      ...options.headers,
    };

    const response = await fetch(url, {
      ...options,
      credentials: 'include', // This is important for cookies
      headers,
    });

    const data = await response.json();

    return {
      data: data.data || data, // Handle both {data: [...]} and direct data formats
      status: response.status,
      success: data.success,
      message: data.message,
    };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : 'An error occurred',
      status: 500,
    };
  }
};

// GET request
export const get = <T>(endpoint: string): Promise<ApiResponse<T>> => {
  return request<T>(endpoint, { method: 'GET' });
};

// POST request
export const post = <T>(endpoint: string, body: any): Promise<ApiResponse<T>> => {
  return request<T>(endpoint, {
    method: 'POST',
    body: JSON.stringify(body),
  });
};

// PUT request
export const put = <T>(endpoint: string, body: any): Promise<ApiResponse<T>> => {
  return request<T>(endpoint, {
    method: 'PUT',
    body: JSON.stringify(body),
  });
};

// DELETE request
export const del = <T>(endpoint: string): Promise<ApiResponse<T>> => {
  return request<T>(endpoint, { method: 'DELETE' });
};
