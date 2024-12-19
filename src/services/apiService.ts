import { getAuthHeader } from './authService';

interface ApiResponse<T = any> {
  data?: T;
  error?: ApiError;
  status: number;
  success?: boolean;
  message?: string;
}

interface ApiError {
  message: string;
  status: number;
}

interface RequestInit extends globalThis.RequestInit {
  method: string;
  headers?: { [key: string]: string };
  body?: string;
}

const baseUrl = process.env.NEXT_PUBLIC_MAIN_URL;
const apiToken = process.env.NEXT_PUBLIC_API_TOKEN;

const request = async <T>(
  endpoint: string,
  options: RequestInit = { method: 'GET' }
): Promise<ApiResponse<T>> => {
  try {
    const url = `${baseUrl}${endpoint}`;
    const headers = {
      'Content-Type': 'application/json',
      'x-api-token': apiToken as string,
      ...getAuthHeader(),
      ...options.headers,
    };

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout

    const response = await fetch(url, {
      ...options,
      credentials: 'include',
      headers,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      if (response.status === 401) {
        // Handle unauthorized access
        window.location.href = '/login';
        return {
          error: { message: 'Unauthorized access', status: 401 },
          status: 401,
          success: false,
        };
      }

      const errorData = await response.json().catch(() => ({}));
      return {
        error: { message: errorData.message || 'Server error occurred', status: response.status },
        status: response.status,
        success: false,
      };
    }

    const data = await response.json();

    return {
      data: data.data || data,
      status: response.status,
      success: data.success ?? true,
      message: data.message,
    };
  } catch (error) {
    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        return {
          error: { message: 'Request timeout', status: 408 },
          status: 408,
          success: false,
        };
      }
      return {
        error: { message: error.message, status: 500 },
        status: 500,
        success: false,
      };
    }
    return {
      error: { message: 'An unknown error occurred', status: 500 },
      status: 500,
      success: false,
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
